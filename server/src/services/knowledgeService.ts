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

function http() {
  return axios.create({
    baseURL: AI_BASE_URL,
    headers: { Authorization: `Bearer ${AI_API_KEY}` },
    timeout: 60000,
  })
}

/** 文本向量化（OpenAI 兼容 /embeddings） */
export async function embedTexts(texts: string[]): Promise<number[][]> {
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

  // 2) 关键词通道：pg_trgm word_similarity（中文无需分词）
  let kwScore: { id: number; score: number }[] = []
  try {
    const rows: { id: number; score: number }[] = await prisma.$queryRawUnsafe(`
      SELECT id, similarity(content, '${query.replace(/'/g, "''")}') AS score
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

/**
 * RAG 问答：检索 top4 -> 拼上下文 -> 调 LLM -> 返回带引用的回答
 */
export async function answer(query: string, opts: { level?: string } = {}) {
  const { items } = await hybridSearch(query, { topK: 4, level: opts.level })

  if (!items.length) {
    return {
      answer: '抱歉，我在 GESP 知识库里没有找到与这个问题相关的内容。换个问法试试？',
      sources: [] as Chunk[],
    }
  }

  const context = items
    .map((c, i) => `【资料${i + 1}】级别:GESP${c.level}级 来源:${c.title} 章节:${c.heading}\n${c.content.slice(0, 800)}`)
    .join('\n\n---\n\n')

  const prompt = `你是 GESP C++ 编程考级的知识助手。请只依据下面提供的知识库资料回答用户问题。

要求：
1. 只使用资料里的内容作答，不要编造资料里没有的知识
2. 回答用小朋友能懂的语言，简洁清楚
3. 在回答末尾用 [来源1] [来源2] 标注参考了哪些资料
4. 如果资料不足以回答问题，直接说"资料里没找到相关内容"

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

  return { answer: answerText, sources: items }
}
