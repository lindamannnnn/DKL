import { useEffect, useState } from 'react'
import {
  Search, Sparkles, BookOpen, FileText, GraduationCap, ClipboardList,
  Loader2, AlertCircle,
} from 'lucide-react'
import Layout from '../components/Layout'
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

interface StatRow { level: string; type: string; n: number }

const TYPE_LABEL: Record<string, string> = {
  course: '微课',
  lesson_plan: '教案',
  syllabus: '考纲',
  exam: '真题',
}

const SUGGESTIONS = [
  '什么是数组？',
  'for 循环怎么用？',
  '进制转换怎么做？',
  '什么是结构体？',
]

export default function KnowledgeSearchPage() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'search' | 'ask'>('search')
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<StatRow[]>([])
  const [searchRes, setSearchRes] = useState<SearchResp | null>(null)
  const [askRes, setAskRes] = useState<AskResp | null>(null)
  const [error, setError] = useState('')
  const [showSources, setShowSources] = useState(false)

  useEffect(() => {
    client.get('/knowledge/stats').then((r: any) => setStats(r.byLevel || [])).catch(() => {})
  }, [])

  const doSearch = async (q: string) => {
    setLoading(true)
    setError('')
    setSearchRes(null)
    setAskRes(null)
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
    try {
      const resp: any = await client.post('/knowledge/ask', {
        query: q, level: level || undefined,
      })
      setAskRes(resp as AskResp)
    } catch (e: any) {
      setError(e.message || '问答失败')
    } finally {
      setLoading(false)
    }
  }

  const submit = () => {
    const q = query.trim()
    if (!q) return
    if (mode === 'ask') doAsk(q)
    else doSearch(q)
  }

  const totalChunks = stats.reduce((s, r) => s + Number(r.n), 0)

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* 标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-blue-500" />
              知识快查
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              GESP 1-8 级知识库检索（RAG）。微课 {stats.filter(s => s.type === 'course').reduce((a, b) => a + Number(b.n), 0)} +
              教案 {stats.filter(s => s.type === 'lesson_plan').reduce((a, b) => a + Number(b.n), 0)} +
              考纲 + 真题 共 {totalChunks} 个知识块
            </p>
          </div>

          {/* 搜索区 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            {/* 模式切换 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setMode('ask')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition ${
                    mode === 'ask' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> AI 问答
                </button>
                <button
                  onClick={() => setMode('search')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition ${
                    mode === 'search' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  <Search className="w-4 h-4" /> 知识检索
                </button>
              </div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="ml-auto text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
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
                  ? '输入问题，AI 将基于 GESP 知识库回答，例如：什么是数组？'
                  : '输入关键词，检索 GESP 知识库，例如：数组'}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
              <button
                onClick={submit}
                disabled={loading || !query.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2 transition"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'ask' ? <Sparkles className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                {mode === 'ask' ? '提问' : '搜索'}
              </button>
            </div>

            {/* 建议问题 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); if (mode === 'ask') doAsk(s); else doSearch(s) }}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-500 border border-gray-100 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 错误 */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* AI 问答结果 */}
          {askRes && (
            <div className="space-y-4 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-3 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="font-semibold">AI 回答</h2>
                </div>
                <div className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">{askRes.answer}</div>
                {askRes.sources.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowSources(v => !v)}
                      className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {showSources ? '收起参考来源' : `查看参考来源（${askRes.sources.length}）`}
                    </button>
                    {showSources && (
                      <div className="mt-3 grid gap-2">
                        {askRes.sources.map((c, i) => <ChunkCard key={c.id} c={c} index={i + 1} />)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 检索结果 */}
          {searchRes && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>找到 {searchRes.items.length} 个相关知识点</span>
                {!searchRes.usedKeywords && <span className="text-xs">向量通道不可用，已用关键词检索</span>}
              </div>
              {searchRes.items.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
                  没有找到相关内容，换个关键词试试？
                </div>
              )}
              {searchRes.items.map((c, i) => <ChunkCard key={c.id} c={c} index={i + 1} />)}
            </div>
          )}

          {/* 初始引导 */}
          {!loading && !error && !searchRes && !askRes && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              <div className="flex justify-center gap-6 mb-6 text-gray-300">
                <BookOpen className="w-10 h-10" />
                <FileText className="w-10 h-10" />
                <GraduationCap className="w-10 h-10" />
                <ClipboardList className="w-10 h-10" />
              </div>
              <p className="text-sm mb-2">输入问题，检索 GESP 1-8 级全部课件与资料</p>
              <p className="text-xs">
                「AI 问答」：检索相关知识 → 生成带引用回答（RAG）
                <br />
                「知识检索」：向量 + 关键词混合检索，直接看命中的原文片段
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function ChunkCard({ c, index }: { c: Chunk; index: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-medium bg-blue-50 text-blue-600 rounded px-2 py-0.5">
          来源 {index}
        </span>
        <span className="text-xs font-medium bg-gray-100 text-gray-600 rounded px-2 py-0.5">
          GESP {c.level} 级 · {TYPE_LABEL[c.type] || c.type}
        </span>
        {c.vecScore !== null && (
          <span className="text-xs text-gray-400" title="向量相似度">
            语义 {(c.vecScore * 100).toFixed(0)}%
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400 truncate max-w-[40%]" title={c.source}>
          {c.title}
        </span>
      </div>
      {c.heading && c.heading !== c.title && (
        <div className="text-xs text-gray-500 mb-1">{c.heading}</div>
      )}
      <div className="text-sm text-gray-600 leading-6 line-clamp-4">{c.content}</div>
    </div>
  )
}
