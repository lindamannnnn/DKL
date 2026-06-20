import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Clock, Database } from 'lucide-react'
import Layout from '../components/Layout'
import client from '../api/client'

interface Problem {
  id: string
  title: string
  difficulty: string
  gespLevel: number | null
  tags: string[]
  timeLimit: number
  memoryLimit: number
}

const levelLabel: Record<number, string> = {
  1: 'GESP 1级',
  2: 'GESP 2级',
  3: 'GESP 3级',
  4: 'GESP 4级',
  5: 'GESP 5级',
  6: 'GESP 6级',
  7: 'GESP 7级',
  8: 'GESP 8级',
}

export default function ProblemLevelPage() {
  const { level } = useParams()
  const levelNum = parseInt(level || '0', 10)

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('')

  useEffect(() => {
    if (!levelNum) return
    loadProblems()
  }, [levelNum])

  const loadProblems = async () => {
    setLoading(true)
    try {
      const res: any = await client.get(`/problems?level=${levelNum}`)
      setProblems(res)
    } catch (err) {
      console.error('加载题目失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const grouped = useMemo(() => {
    const map: Record<string, Problem[]> = {}
    for (const p of problems) {
      const tags = (p.tags || [])
        .map((t) => t.trim())
        .filter((t) => t && t !== '东方博宜')
      const category = tags[0] || '未分类'
      if (!map[category]) map[category] = []
      map[category].push(p)
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))
  }, [problems])

  useEffect(() => {
    if (grouped.length > 0 && !activeCategory) {
      setActiveCategory(grouped[0][0])
    }
  }, [grouped, activeCategory])

  const activeList = useMemo(
    () => grouped.find(([category]) => category === activeCategory)?.[1] || [],
    [grouped, activeCategory]
  )

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            to="/student/problems"
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回等级列表
          </Link>

          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900">{levelLabel[levelNum] || '未知等级'}</h1>
            <p className="text-sm text-gray-500 mt-1">共 {problems.length} 道题目，按分类展示</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">加载中...</div>
          ) : grouped.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              该等级下暂无题目
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-5">
              {/* 左侧分类导航 */}
              <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                    分类
                  </div>
                  <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
                    {grouped.map(([category, list]) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition border-b border-gray-100 last:border-0 ${
                          activeCategory === category
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate pr-2">{category}</span>
                        <span
                          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                            activeCategory === category
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {list.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* 右侧题目列表 */}
              <main className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">{activeCategory}</h2>
                    <span className="text-xs text-white/90">共{activeList.length}题</span>
                  </div>
                  {activeList.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">该分类下暂无题目</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700 w-16">#</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">标题</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">限制</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeList.map((problem, pidx) => (
                          <tr
                            key={problem.id}
                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3 text-gray-500">{pidx + 1}</td>
                            <td className="px-4 py-3">
                              <Link
                                to={`/student/problems/${problem.id}`}
                                className="font-medium text-gray-900 hover:text-primary-600 transition"
                              >
                                {problem.title}
                              </Link>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {problem.timeLimit}ms
                                </span>
                                <span className="flex items-center gap-1">
                                  <Database className="w-3.5 h-3.5" />
                                  {problem.memoryLimit}MB
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </main>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
