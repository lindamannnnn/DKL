/**
 * GESP 知识快查 - RAG 服务
 *
 * - embedText(): 调智谱 embedding-3 把查询转 1024 维向量
 * - hybridSearch(): 向量检索(pgvector 余弦) + 关键词检索(pg_trgm 相似度) 融合排序
 * - answer(): 检索结果 + 问题 拼 prompt 调 LLM，回答带引用
 *
 * key 配置（server/.env）：
 *   AI_API_KEY=<智谱key>            （embedding 与问答同源）
 *   AI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
 *   AI_MODEL=glm-4-flash
 */
import axios from 'axios'
import { prisma } from '../utils/prisma'

const AI_API_KEY =
  process.env.AI_API_KEY ||
  process.env.KIMI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  ''
const AI_BASE_URL = (
  process.env.AI_BASE_URL ||
  process.env.KIMI_BASE_URL ||
  'https://open.bigmodel.cn/api/paas/v4'
).replace(/\/$/, '')
const AI_MODEL = process.env.AI_MODEL || 'glm-4-flash'
const EMBED_MODEL = process.env.AI_EMBED_MODEL || 'embedding-3'
const EMBED_DIM = 1024
const VEC_FIELD = 'embedding'
// 本地 embedding 微服务（bge-m3，免费离线）；不可用时退回 API
const LOCAL_EMBED_URL = (process.env.LOCAL_EMBED_URL || 'http://127.0.0.1:8765').replace(/\/$/, '')

function http() {
  return axios.create({
    baseURL: AI_BASE_URL,
    headers: { Authorization: `Bearer ${AI_API_KEY}` },
    timeout: 60000,
  })
}

/** 文本向量化：优先本地 bge-m3 微服务，失败退智谱 embedding API */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  // 每次尝试本地（不永久锁死，embed_server 可能稍后启动/恢复）
  try {
    const res = await axios.post(`${LOCAL_EMBED_URL}/embed`, { texts }, { timeout: 30000 })
    const data = res.data
    if (data && Array.isArray(data.vectors) && data.vectors.length === texts.length) {
      return data.vectors
    }
    console.warn('[knowledge] 本地 embed 返回异常，退回 API')
  } catch (e: any) {
    console.warn('[knowledge] 本地 embed 不可用，退智谱 API:', e.message)
  }
  const client = http()
  const out: number[][] = []
  // 每批最多 32 条
  for (let i = 0; i < texts.length; i += 32) {
    const batch = texts.slice(i, i + 32)
    const res = await client.post('/embeddings', {
      model: EMBED_MODEL,
      input: batch,
      dimensions: EMBED_DIM,
    })
    const items: { embedding: number[] }[] = res.data.data
    out.push(...items.map(d => d.embedding))
  }
  return out
}

export interface Chunk {
  id: number
  level: string
  type: string
  source: string
  title: string
  heading: string
  content: string
  score: number // 融合后分数（越高越相关）
  vecScore: number | null
  kwScore: number | null
}

/**
 * 混合检索：向量 top30 + 关键词 top30 -> 按 RRF 融合取 topK。
 * level 可过滤（如 '1'）；type 可过滤。
 */
export async function hybridSearch(
  query: string,
  opts: { topK?: number; level?: string; type?: string } = {},
): Promise<{ items: Chunk[]; vec: number[] | null; usedKeywords: boolean }> {
  const topK = opts.topK || 8
  const filterLevel = opts.level
  const filterType = opts.type

  const where = (() => {
    const conds: string[] = ["tenant_id = 'default'"]
    if (filterLevel) conds.push(`level = '${filterLevel.replace(/[^0-9]/g, '')}'`)
    if (filterType) conds.push(`type = '${filterType.replace(/[^a-z_]/g, '')}'`)
    return conds.join(' AND ')
  })()

  let queryVec: number[] | null = null
  let vecScore: { id: number; score: number }[] = []

  // 1) 向量通道：embedding 失败不阻塞，退回纯关键词
  try {
    ;[queryVec] = await embedTexts([query])
    const rows: { id: number; score: number }[] = await prisma.$queryRawUnsafe(`
      SELECT id, 1 - (${VEC_FIELD} <=> '${vecToSql(queryVec)}'::vector) AS score
      FROM knowledge_chunks
      WHERE ${where} AND ${VEC_FIELD} IS NOT NULL
      ORDER BY ${VEC_FIELD} <=> '${vecToSql(queryVec)}'::vector
      LIMIT 30
    `)
    vecScore = rows.map(r => ({ id: Number(r.id), score: Number(r.score) }))
  } catch (e: any) {
    console.warn('[knowledge] 向量检索失败，退化关键词通道:', e.message)
  }

  // 2) 关键词通道：标题/章节精确相似度 与 正文词级相似度 取大值
  //    （实测：只用 similarity(content,q) 时中文短查询分数被稀释，排不上真正的答案；
  //     标题参与后「KMP」「进制转换」「三级考纲」等查询可直接命中对应条目）
  let kwScore: { id: number; score: number }[] = []
  try {
    const q = query.replace(/'/g, "''")
    const rows: { id: number; score: number }[] = await prisma.$queryRawUnsafe(`
      SELECT id, GREATEST(
        similarity(title || ' ' || heading, '${q}'),
        word_similarity('${q}', left(content, 2000))
      ) AS score
      FROM knowledge_chunks
      WHERE ${where}
      ORDER BY score DESC
      LIMIT 30
    `)
    kwScore = rows.map(r => ({ id: Number(r.id), score: Number(r.score) }))
  } catch (e: any) {
    console.warn('[knowledge] 关键词检索失败:', e.message)
  }

  const usedKeywords = kwScore.length > 0

  // 3) RRF 融合
  const rrf = new Map<number, { s: number; v: number | null; k: number | null }>()
  const K = 60
  vecScore.forEach((r, i) => {
    const cur = rrf.get(r.id) || { s: 0, v: null, k: null }
    cur.s += 1 / (K + i + 1)
    cur.v = r.score
    rrf.set(r.id, cur)
  })
  kwScore.forEach((r, i) => {
    const cur = rrf.get(r.id) || { s: 0, v: null, k: null }
    cur.s += 1 / (K + i + 1)
    cur.k = r.score
    rrf.set(r.id, cur)
  })

  const ranked = [...rrf.entries()]
    .sort((a, b) => b[1].s - a[1].s)
    .slice(0, topK)

  const ids = ranked.map(([id]) => id)
  if (!ids.length) return { items: [], vec: queryVec, usedKeywords }

  const chunks = await prisma.$queryRawUnsafe(`
    SELECT id, level, type, source, title, heading, content
    FROM knowledge_chunks WHERE id IN (${ids.join(',')})
  `) as any[]

  const byId = new Map(chunks.map((c: any) => [Number(c.id), c]))
  const items: Chunk[] = ranked.map(([id, r]) => {
    const c = byId.get(id)!
    return {
      id: Number(c.id),
      level: c.level,
      type: c.type,
      source: c.source,
      title: c.title,
      heading: c.heading,
      content: c.content,
      score: r.s,
      vecScore: r.v,
      kwScore: r.k,
    }
  })
  return { items, vec: queryVec, usedKeywords }
}

function vecToSql(v: number[]): string {
  return `[${v.map(n => n.toFixed(6)).join(',')}]`
}

const NO_HIT = '抱歉，我在 GESP 知识库里没有找到与这个问题相关的内容。换个问法试试？'

// 相关性闸门：两个通道都不够相关时直接拒答，不把资料丢给 LLM（防止"硬答+编造"）
// 阈值由 46 题评测标定：库内题最低 vec=0.514(但 kw=0.30)，库外无关题 vec 普遍 <0.60 且 kw≈0
const VEC_GATE = Number(process.env.RAG_VEC_GATE ?? 0.60)
const KW_GATE = Number(process.env.RAG_KW_GATE ?? 0.15)
// 问题里的技术术语在资料中的命中率低于此值 → 判为资料不覆盖，直接拒答
const TERM_GATE = Number(process.env.RAG_TERM_RATIO ?? 0.5)

// 通用英文词：不作为"问题核心技术术语"参与校验
const TERM_STOP = new Set([
  'the', 'and', 'for', 'int', 'cout', 'cin', 'main', 'using', 'namespace', 'std',
  'return', 'void', 'else', 'while', 'how', 'what', 'why', 'use', 'get', 'set',
  'code', 'c++', 'cpp', 'out', 'new', 'this', 'that', 'with', 'from',
])

/**
 * 术语闸门：问题里出现的技术术语（英文/数字，长度≥3），在资料里一个都没出现时判定为"资料不覆盖"。
 * 用于拦截张冠李戴（例：资料讲"二叉树"，用户问 MySQL 的 B+树 —— 资料里根本没有 MySQL 这个词）。
 */
function termGate(query: string, context: string): { ratio: number; hits: string[]; miss: string[] } {
  if (process.env.RAG_TERM_GATE === '0') return { ratio: 1, hits: [], miss: [] }
  const terms = [...new Set((query.match(/[A-Za-z][A-Za-z0-9+#._]{2,}/g) || []))]
    .filter(t => !TERM_STOP.has(t.toLowerCase()))
  if (!terms.length) return { ratio: 1, hits: [], miss: [] }
  const ctx = context.toLowerCase()
  const hits = terms.filter(t => ctx.includes(t.toLowerCase()))
  const miss = terms.filter(t => !ctx.includes(t.toLowerCase()))
  return { ratio: hits.length / terms.length, hits, miss }
}

/**
 * 把检索到的资料片段拼成给 LLM 的上下文（ask/teach 共用）
 */
function buildContext(items: Chunk[], cap = 1000): string {
  return items
    .map((c, i) => `【资料${i + 1}】级别:GESP${c.level}级 来源:${c.title} 章节:${c.heading}\n${c.content.slice(0, cap)}`)
    .join('\n\n---\n\n')
}

/**
 * RAG 问答：检索 top6 -> 相关性闸门 -> 拼上下文 -> 调 LLM -> 清洗伪造引用 -> 附真实来源
 */
export async function answer(query: string, opts: { level?: string } = {}) {
  const { items } = await hybridSearch(query, { topK: 6, level: opts.level })

  if (!items.length) {
    return { answer: NO_HIT, sources: [] as Chunk[] }
  }

  const bestVec = Math.max(...items.map(i => i.vecScore ?? 0))
  const bestKw = Math.max(...items.map(i => i.kwScore ?? 0))
  if (bestVec < VEC_GATE && bestKw < KW_GATE) {
    return { answer: NO_HIT, sources: [] as Chunk[], gate: { bestVec, bestKw } }
  }

  const context = buildContext(items)

  const tg = termGate(query, context)
  if (tg.ratio < TERM_GATE) {
    return {
      answer: NO_HIT,
      sources: [] as Chunk[],
      gate: { bestVec, bestKw, termRatio: Number(tg.ratio.toFixed(2)), termMiss: tg.miss },
    }
  }

  const prompt = `你是 GESP C++ 编程考级的知识助手。请只依据下面提供的知识库资料回答用户问题。

要求：
1. 只使用资料里的内容作答，不要编造资料里没有的知识
2. 回答用小朋友能懂的语言，简洁清楚
3. 在回答末尾用 [来源1] [来源2] 标注参考了哪些资料
4. 如果资料不足以回答问题，直接说"资料里没找到相关内容"
5. 【重要-防张冠李戴】用户问题里提到的专有名词（如 B+树、MySQL、某个具体算法名）
   必须在资料里真实出现过，才允许回答。资料里只有"相似但不相同"的概念时
   （例如资料讲"二叉树"，用户却问"B+树"），必须回答"资料里没找到相关内容"，
   不允许用相似概念套上去解释。
6. 涉及代码时给出完整可运行的代码片段，并配一句关键步骤说明
7. 【重要-不要自己写引用】不要自己编造资料标题，也不要写 [来源X]，
   系统会在你的回答后面自动附上真实来源。你只负责回答内容本身。

知识库资料：
${context}

用户问题：${query}
请回答：`

  let answerText = ''
  try {
    const client = http()
    const res = await client.post('/chat/completions', {
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    })
    answerText = (res.data.choices?.[0]?.message?.content || '').trim()
  } catch (e: any) {
    console.error('[knowledge] LLM 问答失败:', e.message)
    answerText = '（AI 回答暂时不可用，以下为知识库检索结果，请参考相关来源。）'
  }

  // 引用与生成解耦：模型写的 [来源X] 一律清除，来源由后端据实附加
  // （评测中发现模型会伪造来源标题，例如给「红烧肉」答案配上 [来源1] 红烧肉的做法）
  let finalText = answerText.replace(/\[来源[^\]]*\]/g, '').replace(/\n{3,}/g, '\n\n').trim()
  const noHit = /没找到|没有找到|超出范围|无法回答/.test(answerText)
  if (!noHit && items.length) {
    const srcList = items
      .map((c, i) => `${i + 1}. 《${c.title}》${c.heading ? ` · ${c.heading}` : ''}` +
        `${c.level ? ` (GESP${c.level}级)` : ''}`)
      .join('\n')
    finalText += `\n\n---\n参考来源：\n${srcList}`
  }

  return { answer: finalText, sources: items, gate: { bestVec, bestKw } }
}

// ============================== 编程老师讲解（teach） ==============================
// 与 answer 共用检索+闸门，但换"耐心编程老师"人设，按固定教学结构把知识点重新讲一遍。
// 事实(语法/规则/代码行为)必须依据资料；教学比喻/例子/思考题允许老师创作，但不许与资料相悖。

const NO_HIT_TEACH =
  '这个问题我在书库里没找到对应的教学资料，不能乱讲。\n\n' +
  '你可以换一个更具体的问法（比如带上具体概念名：数组、循环、结构体、sort……），' +
  '或者先问问真人老师，我们一起把问题说清楚再继续。'

const TEACH_SYSTEM = `你是 DKL 学习平台的 C++ 编程老师，专门给小学 4-6 年级学生讲课。

【第一优先 · 是否该讲（先判断再讲课）】
先检查：学生想学的概念，知识库资料里是否真的有？判断要点：
- 学生问的级别（如"GESP九级"）如果资料里根本没有对应级别的考纲/课程（资料只到 GESP 8 级，
  或最高只检索到五级/六级资料），说明库里没有他要学的内容 → 必须拒绝，不能拿别的级别硬讲。
- 学生问的专有名词（算法名、数据结构名、函数名等）如果在资料里根本没出现，只有"长得像"的
  其它概念 → 必须拒绝，绝不允许用相似概念顶替（例：资料讲"二叉树"，学生问"B+树"，要拒绝）。
- 一旦判断该拒绝，只输出这一句，不要讲任何内容：
  "这个问题我在书库里没找到对应的教学资料，不能乱讲。你可以换一个更具体的问法（比如带上具体概念名：数组、循环、结构体、sort……），或者先问问真人老师。"

【风格】
- 耐心、风趣，像真人老师上课一样；面向零基础孩子，说人话，多打比方，多用 emoji。
- 严谨第一：讲出口的每一个语法、规则、代码行为必须 100% 正确。

【准确性铁律】
- 知识点事实（概念定义、语法规则、代码怎么写、时间复杂度、函数用法等）只能依据下面给的
  知识库资料讲解，资料里没有的事实绝不编造、绝不张冠李戴。
- 拿不准就说："这部分资料里没有，需要问真人老师确认。" 不要用"可能/大概/应该"糊弄。
- 教学性的比喻、生活例子、练习题是你老师的表达自由，可以自己创作，但不得与资料内容相悖、
  不得歪曲知识点本身。

【讲解结构】严格按下面小标题组织，用 markdown 格式：
## 一句话先听懂
（用一句大白话说明这个知识点是什么，不出现术语堆砌）
## 生活小例子
（用一个孩子身边能懂的比喻/场景，帮他把抽象概念"看见"）
## 核心逻辑
（2-4 条，编号步骤；讲清楚"为什么这样做"，不只讲"怎么做"）
## 代码讲解
（给出一段可运行的 C++ 代码，用 \`\`\`cpp 代码块；在代码下方挑 2-4 行关键代码，
用"行内容 + 人话解释"的方式逐行讲）
## 容易踩的坑
（1-3 个这个知识点最典型的错误/易错点，每个一句话说清错在哪）
## 自己试试
（给 1 道不超过 3 行的微型小练习或一句话思考题，只描述任务，不写出答案代码）

【长度】整体讲解 400-700 字（代码块不计），别啰嗦也别太短；只讲这个知识点，不要扯到课外。`

/** 讲解风格：simpler=更简单再讲一遍；example=换例子和代码再讲一遍 */
const TEACH_STYLE_SUFFIX: Record<string, string> = {
  default: '',
  simpler:
    '\n\n【本次要求】学生刚才没听懂。请用更简单的说法、更多比喻，把概念和代码都讲得再细、再慢一些，篇幅可以更短，去掉"自己试试"。',
  example:
    '\n\n【本次要求】请主要换一个全新的生活例子、换一段不同的示例代码重新讲一遍，其余结构保持不变。',
}

/** teach 公共准备：检索 + 各闸门 → 判定是否可讲。可讲返回 userPrompt，否则返回拒答文案 */
type TeachPrepared =
  | { ok: true; items: Chunk[]; userPrompt: string; gate: { bestVec: number; bestKw: number } }
  | { ok: false; explain: string; sources: Chunk[]; gate: Record<string, unknown> }

async function prepareTeach(
  query: string,
  opts: { level?: string; style?: string },
): Promise<TeachPrepared> {
  const style = ['simpler', 'example'].includes(opts.style || '') ? opts.style! : 'default'
  // 与 ask 保持同一 topK=6 + 同一闸门：相关度判定依赖 46 题评测标定的阈值，
  // 放宽检索(如 8 条)会让边缘噪声抬高 kw 分数而漏掉应拒答的库外题。
  const { items } = await hybridSearch(query, { topK: 6, level: opts.level })

  if (!items.length) {
    return { ok: false, explain: NO_HIT_TEACH, sources: [] as Chunk[], gate: {} }
  }

  const bestVec = Math.max(...items.map(i => i.vecScore ?? 0))
  const bestKw = Math.max(...items.map(i => i.kwScore ?? 0))
  if (bestVec < VEC_GATE && bestKw < KW_GATE) {
    return { ok: false, explain: NO_HIT_TEACH, sources: [] as Chunk[], gate: { bestVec, bestKw } }
  }

  // 级别硬闸门：学生明确问"X级/GESP X级"，但检索到的资料最高级别低于 X → 库里没有，拒答
  // （防"问九级讲五级"这类拿相似级别顶替的漏拒。不依赖模型自觉。）
  const askLevel = (() => {
    const m = query.match(/(?:GESP\s*)?(?:第)?([一二三四五六七八九十\d]+)\s*级/i)
    if (!m) return 0
    const cn = '零一二三四五六七八九'
    const n = cn.indexOf(m[1])
    return n > 0 ? n : parseInt(m[1], 10) || 0
  })()
  if (askLevel > 0) {
    const maxLevel = Math.max(0, ...items.map(i => parseInt(i.level, 10) || 0))
    if (maxLevel < askLevel) {
      return {
        ok: false,
        explain: NO_HIT_TEACH,
        sources: [] as Chunk[],
        gate: { askLevel, maxLevel },
      }
    }
  }

  const context = buildContext(items)

  const tg = termGate(query, context)
  if (tg.ratio < TERM_GATE) {
    return {
      ok: false,
      explain: NO_HIT_TEACH,
      sources: [] as Chunk[],
      gate: { bestVec, bestKw, termRatio: Number(tg.ratio.toFixed(2)), termMiss: tg.miss },
    }
  }

  const userPrompt =
    `请以编程老师的身份，给一个 4-6 年级小学生讲解下面的知识点，严格按系统提示的结构组织。\n\n` +
    `知识库资料：\n${context}\n\n` +
    `学生想学的知识点：${query}\n请开始讲解：` +
    TEACH_STYLE_SUFFIX[style]

  return { ok: true, items, userPrompt, gate: { bestVec, bestKw } }
}

/** 拼接参考来源（真实来源由后端据实附加，防止模型伪造标题） */
function appendTeachSources(text: string, items: Chunk[]): string {
  const srcList = items
    .map((c, i) => `${i + 1}. 《${c.title}》${c.heading ? ` · ${c.heading}` : ''}` +
      `${c.level ? ` (GESP${c.level}级)` : ''}`)
    .join('\n')
  return `${text}\n\n---\n讲解参考来源：\n${srcList}`
}

/**
 * 编程老师讲解（同步）：检索 top6 -> 相关性/级别/术语闸门 -> 老师人设 prompt -> LLM 生成结构化讲解。
 * style: default | simpler | example（轻量"再讲一遍"，不做完整多轮对话）
 */
export async function teach(
  query: string,
  opts: { level?: string; style?: string } = {},
): Promise<{ explain: string; sources: Chunk[]; gate?: Record<string, unknown> }> {
  const prep = await prepareTeach(query, opts)
  if (!prep.ok) {
    return { explain: prep.explain, sources: prep.sources, gate: prep.gate }
  }
  const { items, userPrompt } = prep

  let explainText = ''
  try {
    const client = http()
    const res = await client.post('/chat/completions', {
      model: AI_MODEL,
      messages: [
        { role: 'system', content: TEACH_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 1800,
    })
    explainText = (res.data.choices?.[0]?.message?.content || '').trim()
  } catch (e: any) {
    console.error('[knowledge] LLM 讲解失败:', e.message)
    explainText = '（AI 老师暂时开不了课，以下为知识库检索结果，你可以先看参考来源自学。）'
  }

  // 与 answer 相同：清洗模型伪造的 [来源X]，来源由后端据实附加
  const cleaned = explainText
    .replace(/\[来源[^\]]*\]/g, '')
    .replace(/\[资料[^\]]*\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  const noHit = /没找到|没有找到|超出范围|无法回答|资料里没有/.test(cleaned)
  const finalText = noHit || !items.length ? cleaned : appendTeachSources(cleaned, items)

  return { explain: finalText, sources: items, gate: prep.gate }
}

/**
 * 编程老师讲解（SSE 流式）：检索/闸门与 teach 相同，但 LLM 用 stream:true，
 * 生成的文本逐段回调 onDelta（用于前端打字机展示，避免长输出同步等待超时）。
 * 返回完整文本与真实来源（拒答时 onDelta 会收到一次拒答文案）。
 */
export async function streamTeach(
  query: string,
  opts: { level?: string; style?: string } = {},
  onDelta: (delta: string) => void,
): Promise<{ full: string; sources: Chunk[]; gate: Record<string, unknown> }> {
  const prep = await prepareTeach(query, opts)
  if (!prep.ok) {
    onDelta(prep.explain)
    return { full: prep.explain, sources: prep.sources, gate: prep.gate }
  }
  const { items, userPrompt } = prep

  let full = ''
  try {
    const client = http()
    const res = await client.post(
      '/chat/completions',
      {
        model: AI_MODEL,
        messages: [
          { role: 'system', content: TEACH_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 1800,
        stream: true,
      },
      { responseType: 'stream', timeout: 120000 },
    )
    const stream: NodeJS.ReadableStream = res.data
    let buf = ''
    for await (const raw of stream as any) {
      buf += Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw)
      let idx: number
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const event = buf.slice(0, idx)
        buf = buf.slice(idx + 2)
        const line = event.split('\n').find(l => l.startsWith('data:'))
        if (!line) continue
        const payload = line.slice(5).trim()
        if (!payload || payload === '[DONE]') continue
        try {
          const json = JSON.parse(payload)
          const delta: string = json.choices?.[0]?.delta?.content || ''
          if (delta) {
            full += delta
            onDelta(delta)
          }
        } catch {
          /* 忽略无法解析的碎片 */
        }
      }
    }
  } catch (e: any) {
    console.error('[knowledge] LLM 讲解流式失败:', e.message)
    onDelta('（AI 老师暂时开不了课，以下为知识库检索结果，你可以先看参考来源自学。）')
  }

  return { full, sources: items, gate: prep.gate }
}
