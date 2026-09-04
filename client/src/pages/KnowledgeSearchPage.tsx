import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'
import {
  Search, Sparkles, BookOpen, FileText, GraduationCap, ClipboardList,
  Loader2, AlertCircle, BookOpenCheck, ChevronRight, RefreshCcw,
} from 'lucide-react'
import GuildNav from '../components/GuildNav'
import client from '../api/client'

interface Chunk {
  id: number
  level: string
  type: string
  source: string
  title: string
  heading: string
  content: string
  score: number
  vecScore: number | null
  kwScore: number | null
}

interface SearchResp {
  items: Chunk[]
  usedKeywords: boolean
}

interface AskResp {
  answer: string
  sources: Chunk[]
}

interface TeachResp {
  explain: string
  sources: Chunk[]
}

interface StatRow { level: string; type: string; n: number }

const TYPE_LABEL: Record<string, string> = {
  lesson_plan: '教案',
  outline: '大纲',
  template: '算法模板',
  reference: '参考文档',
  syllabus: '考纲',
}

const SUGGESTIONS = [
  '什么是数组？',
  'for 循环怎么用？',
  '进制转换怎么做？',
  '什么是结构体？',
]

/** 读 /knowledge/teach 的 SSE 流：逐 delta 回调，返回 { text, sources } */
async function fetchTeachStream(
  q: string,
  level: string,
  style: string,
  onDelta: (d: string) => void,
): Promise<{ text: string; sources: Chunk[] }> {
  const token = localStorage.getItem('token') || localStorage.getItem('dkl_token') || ''
  const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('dkl_tenantId') || ''
  const base = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:4001'

  const resp = await fetch(`${base}/api/knowledge/teach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'X-Tenant-Id': tenantId } : {}),
    },
    body: JSON.stringify({ query: q, level: level || undefined, style, stream: true }),
  })
  if (!resp.ok) {
    let msg = `讲解服务异常（${resp.status}）`
    try {
      const j = await resp.json()
      if (j?.error) msg = j.error
    } catch { /* ignore */ }
    throw new Error(msg)
  }
  if (!resp.body) throw new Error('浏览器不支持流式读取')

  const reader = resp.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buf = ''
  let text = ''
  let sources: Chunk[] = []

  const handleEvent = (etype: string, payload: string) => {
    if (!payload) return
    try {
      const data = JSON.parse(payload)
      if (etype === 'delta' && typeof data.text === 'string') {
        text += data.text
        onDelta(data.text)
      } else if (etype === 'done') {
        if (typeof data.text === 'string') text = data.text
        sources = Array.isArray(data.sources) ? data.sources : []
      }
    } catch { /* ignore */ }
  }

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    // SSE 事件以空行分隔，按 event/data 行解析
    let sep: number
    while ((sep = buf.indexOf('\n\n')) >= 0) {
      const block = buf.slice(0, sep)
      buf = buf.slice(sep + 2)
      let etype = 'message'
      let payload = ''
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) etype = line.slice(6).trim()
        else if (line.startsWith('data:')) payload += line.slice(5).trim()
      }
      handleEvent(etype, payload)
    }
  }
  return { text, sources }
}

export default function KnowledgeSearchPage() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'ask'>('ask')
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<StatRow[]>([])
  const [searchRes, setSearchRes] = useState<SearchResp | null>(null)
  const [askRes, setAskRes] = useState<AskResp | null>(null)
  const [error, setError] = useState('')
  const [showSources, setShowSources] = useState(false)
  // 编程老师讲解
  const [explain, setExplain] = useState<TeachResp | null>(null)
  const [explaining, setExplaining] = useState(false)
  const [explainStyle, setExplainStyle] = useState<'default' | 'simpler' | 'example'>('default')
  const [lastAsked, setLastAsked] = useState('')
  // 流式打字机：累积缓冲 + rAF 合并渲染（SSE delta 常达数百块，逐块 setState 会卡顿）
  const [streamText, setStreamText] = useState('')
  const streamBufRef = useRef('')
  const rafRef = useRef(0)
  const flushStream = () => {
    rafRef.current = 0
    setStreamText(streamBufRef.current)
  }
  const pushDelta = (d: string) => {
    streamBufRef.current += d
    if (!rafRef.current) rafRef.current = requestAnimationFrame(flushStream)
  }

  useEffect(() => {
    client.get('/knowledge/stats').then((r: any) => setStats(r.byLevel || [])).catch(() => {})
  }, [])

  const doSearch = async (q: string) => {
    setLoading(true)
    setError('')
    setSearchRes(null)
    setAskRes(null)
    setExplain(null)
    try {
      const resp: any = await client.post('/knowledge/search', {
        query: q, level: level || undefined,
      })
      setSearchRes(resp as SearchResp)
    } catch (e: any) {
      setError(e.message || '检索失败')
    } finally {
      setLoading(false)
    }
  }

  const doAsk = async (q: string) => {
    setLoading(true)
    setError('')
    setSearchRes(null)
    setAskRes(null)
    setExplain(null)
    try {
      const resp: any = await client.post('/knowledge/ask', {
        query: q, level: level || undefined,
      })
      setAskRes(resp as AskResp)
      setLastAsked(q)
    } catch (e: any) {
      setError(e.message || '问答失败')
    } finally {
      setLoading(false)
    }
  }

  // 编程老师讲解：基于最近一次 ask 的问题，用老师人设重新讲一遍
  const doTeach = async (q: string, style: 'default' | 'simpler' | 'example' = 'default') => {
    if (!q.trim()) return
    setExplaining(true)
    setError('')
    setExplain(null)
    setExplainStyle(style)
    // 流式缓冲复位
    streamBufRef.current = ''
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    setStreamText('')
    try {
      const result = await fetchTeachStream(q.trim(), level, style, pushDelta)
      // 确保最后一帧渲染完成
      streamBufRef.current = result.text
      setStreamText(result.text)
      setExplain({ explain: result.text, sources: result.sources || [] })
    } catch (e: any) {
      setExplain(null)
      setStreamText('')
      setError(e.message || '讲解失败，请稍后再试')
    } finally {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      setExplaining(false)
    }
  }

  const teachQuery = () => {
    const q = (query.trim() || lastAsked || '').trim()
    doTeach(q, 'default')
  }

  const submit = () => {
    const q = query.trim()
    if (!q) return
    if (mode === 'ask') doAsk(q)
    else doSearch(q)
  }

  const totalChunks = stats.reduce((s, r) => s + Number(r.n), 0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* 星空 / 冒险氛围背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,138,0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(120,53,15,0.25),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* 星星点缀 */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: 0.2 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 顶部导航：冒险公会 */}
      <GuildNav />

      <div className="relative max-w-5xl mx-auto px-4 py-10">
        {/* ========== 页头：智慧书库 ========== */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 text-sm font-bold mb-4 backdrop-blur-sm">
            <BookOpenCheck className="w-4 h-4" />
            公会藏书阁 · 知识秘典
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            智慧书库
          </h1>
          <p className="text-amber-100/70 text-base mt-3 max-w-2xl leading-relaxed">
            冒险家，遇到难题别硬闯！这里收录了 GESP 1-8 级全部知识秘典，
            <span className="text-amber-300 font-bold">问 AI 向导</span>或{' '}
            <span className="text-amber-300 font-bold">翻查典籍</span>，马上找到答案。
          </p>
          <p className="text-amber-200/40 text-xs mt-2">
            共 {totalChunks} 卷典籍
            {stats.filter(s => Number(s.n) > 0).map(s => ` · ${TYPE_LABEL[s.type] || s.type} ${s.n}`).join('')}
          </p>
        </div>

        {/* ========== 查询台 ========== */}
        <div className="relative bg-slate-900/80 border-2 border-amber-500/25 rounded-3xl p-6 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          {/* 羊皮纸噪点 */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative">
            {/* 模式切换 */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="flex rounded-xl bg-slate-950/80 border border-slate-700/60 p-1">
                <button
                  onClick={() => setMode('ask')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition ${
                    mode === 'ask'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg'
                      : 'text-amber-100/60 hover:text-amber-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> 问 AI 向导
                </button>
                <button
                  onClick={() => setMode('search')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition ${
                    mode === 'search'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg'
                      : 'text-amber-100/60 hover:text-amber-100'
                  }`}
                >
                  <Search className="w-4 h-4" /> 翻查典籍
                </button>
              </div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="ml-auto text-sm bg-slate-950/80 border border-slate-700/60 rounded-lg px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                <option value="">全部级别</option>
                {['1','2','3','4','5','6','7','8'].map(l => (
                  <option key={l} value={l}>GESP {l} 级</option>
                ))}
              </select>
            </div>

            {/* 输入框 */}
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder={mode === 'ask'
                  ? '输入你的难题，AI 向导从书库找答案，例如：什么是数组？'
                  : '输入要查找的知识，例如：数组'}
                className="flex-1 bg-slate-950/70 border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40"
              />
              <button
                onClick={submit}
                disabled={loading || !query.trim()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-sm font-black flex items-center gap-2 transition shadow-lg"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'ask' ? <Sparkles className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                {loading ? '查找中' : mode === 'ask' ? '开始求解' : '开始查找'}
              </button>
            </div>

            {/* 快捷疑问 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); if (mode === 'ask') doAsk(s); else doSearch(s) }}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-950/60 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 text-amber-100/50 border border-slate-700/60 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 错误 */}
        {error && (
          <div className="flex items-center gap-2 text-red-300 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* AI 问答结果 */}
        {askRes && (
          <div className="space-y-4 mb-6">
            <div className="relative bg-slate-900/80 border border-amber-500/25 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
              <div className="flex items-center gap-2 mb-4 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-black text-amber-300">AI 向导的回答</h2>
              </div>
              {/* AI 向导的回答 —— markdown 渲染，代码块高亮 */}
              <div className="guild-md mt-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {askRes.answer}
                </ReactMarkdown>
              </div>

              {/* 让老师讲一遍（未开始时显示） */}
              {!explain && !streamText && !explaining && (
                <div className="mt-5 border-t border-slate-700/60 pt-4 flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs text-slate-400">
                    光看答案还差点意思？让编程老师用大白话把逻辑和代码重新讲一遍。
                  </p>
                  <button
                    onClick={teachQuery}
                    disabled={explaining}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-400 hover:to-purple-400 disabled:opacity-60 text-white text-sm font-black shadow-lg transition"
                  >
                    {explaining ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />老师备课中…</>
                    ) : (
                      <><GraduationCap className="w-4 h-4" />让老师讲一遍</>
                    )}
                  </button>
                </div>
              )}

              {/* 编程老师课堂（流式打字机 / 最终讲解） */}
              {(explain || streamText) && (
                <div className="mt-5 border-t border-slate-700/60 pt-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2 text-amber-300">
                      <GraduationCap className="w-5 h-5" />
                      <h3 className="font-black text-lg">编程老师课堂</h3>
                      {explaining && (
                        <span className="text-xs text-amber-200/60 flex items-center gap-1 font-bold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {explainStyle === 'simpler' ? '换个简单说法讲…' : explainStyle === 'example' ? '换新例子讲…' : '老师开讲中…'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => doTeach((query.trim() || lastAsked), 'simpler')}
                        disabled={explaining}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 font-bold transition disabled:opacity-50"
                      >
                        😅 没听懂，换简单说法
                      </button>
                      <button
                        onClick={() => doTeach((query.trim() || lastAsked), 'example')}
                        disabled={explaining}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 font-bold transition disabled:opacity-50"
                      >
                        <RefreshCcw className="w-3 h-3 inline mr-1" />换个例子再讲
                      </button>
                    </div>
                  </div>

                  {/* 流式 / 最终 markdown 渲染 */}
                  <div className="guild-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {explain ? explain.explain : streamText}
                    </ReactMarkdown>
                  </div>
                  {explaining && !explain && (
                    <div className="text-xs text-amber-200/40 mt-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      老师还在写…内容会继续出现
                    </div>
                  )}

                  {explain && explain.sources.length > 0 && (
                    <div className="mt-4 border-t border-slate-700/60 pt-3">
                      <button
                        onClick={() => setShowSources(v => !v)}
                        className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-bold"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {showSources ? '收起参考典籍' : `查看讲解参考典籍（${explain.sources.length}）`}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSources ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {askRes.sources.length > 0 && !explain && (
                <div className="mt-5 border-t border-slate-700/60 pt-4">
                  <button
                    onClick={() => setShowSources(v => !v)}
                    className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-bold"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {showSources ? '收起参考典籍' : `查看参考典籍（${askRes.sources.length}）`}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSources ? 'rotate-90' : ''}`} />
                  </button>
                  {showSources && (
                    <div className="mt-3 grid gap-2">
                      {askRes.sources.map((c, i) => <ChunkCard key={c.id} c={c} index={i + 1} />)}
                    </div>
                  )}
                </div>
              )}

              {/* 讲解的来源展示（用全局折叠开关，覆盖问询来源时共用一个列表会混乱，故讲解时优先展示讲解来源） */}
              {explain && explain.sources.length > 0 && showSources && (
                <div className="mt-3 grid gap-2">
                  {explain.sources.map((c, i) => <ChunkCard key={`t${c.id}`} c={c} index={i + 1} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 检索结果 */}
        {searchRes && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm text-amber-100/60">
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-400" />
                找到 <span className="text-amber-300 font-black">{searchRes.items.length}</span> 条相关典籍
              </span>
              {!searchRes.usedKeywords && <span className="text-xs text-slate-500">已为你翻开知识秘典</span>}
            </div>
            {searchRes.items.length === 0 && (
              <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-10 text-center text-slate-400 text-sm">
                书库里没有找到相关内容，换个说法再试试？
              </div>
            )}
            {searchRes.items.map((c, i) => <ChunkCard key={c.id} c={c} index={i + 1} />)}
          </div>
        )}

        {/* 初始引导 */}
        {!loading && !error && !searchRes && !askRes && (
          <div className="relative bg-slate-900/60 border-2 border-dashed border-slate-700/60 rounded-3xl p-10 text-center">
            <div className="flex justify-center gap-6 mb-6 text-amber-500/60">
              <div className="flex flex-col items-center gap-1.5">
                <Sparkles className="w-8 h-8" />
                <span className="text-[10px] text-slate-500 font-bold">问 AI 向导</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <BookOpen className="w-8 h-8" />
                <span className="text-[10px] text-slate-500 font-bold">教案</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <FileText className="w-8 h-8" />
                <span className="text-[10px] text-slate-500 font-bold">参考文档</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <GraduationCap className="w-8 h-8" />
                <span className="text-[10px] text-slate-500 font-bold">考纲</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ClipboardList className="w-8 h-8" />
                <span className="text-[10px] text-slate-500 font-bold">算法模板</span>
              </div>
            </div>
            <p className="text-amber-100/70 text-base mb-2 font-bold">冒险卡住了？来这里快速查答案</p>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-6">
              「问 AI 向导」：AI 翻遍书库后给出带出处的解答（RAG）
              <br />
              「翻查典籍」：直接检索命中的原文片段，自己读原文
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ChunkCard({ c, index }: { c: Chunk; index: number }) {
  return (
    <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 hover:border-amber-500/30 transition">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded px-2 py-0.5">
          典籍 {index}
        </span>
        <span className="text-xs font-bold bg-slate-800 text-slate-300 rounded px-2 py-0.5">
          GESP {c.level} 级 · {TYPE_LABEL[c.type] || c.type}
        </span>
        {c.vecScore !== null && (
          <span className="text-xs text-slate-500" title="向量相似度">
            语义 {(c.vecScore * 100).toFixed(0)}%
          </span>
        )}
        <span className="ml-auto text-xs text-amber-100/40 truncate max-w-[40%]" title={c.source}>
          {c.title}
        </span>
      </div>
      {c.heading && c.heading !== c.title && (
        <div className="text-xs text-amber-100/50 mb-1">{c.heading}</div>
      )}
      <div className="text-sm text-slate-300 leading-6 line-clamp-4 font-mono text-[13px]">{c.content}</div>
    </div>
  )
}
