import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Code2, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import client from '../api/client'

interface LevelInfo {
  level: number
  count: number
}

const levelMeta: Record<number, { label: string; color: string; desc: string }> = {
  1: { label: 'GESP 1级', color: 'from-slate-500 to-slate-600', desc: '基础语法与简单程序' },
  2: { label: 'GESP 2级', color: 'from-green-500 to-green-600', desc: '分支与基础算法' },
  3: { label: 'GESP 3级', color: 'from-emerald-500 to-emerald-600', desc: '循环与数组初步' },
  4: { label: 'GESP 4级', color: 'from-cyan-500 to-cyan-600', desc: '字符串与基础数据结构' },
  5: { label: 'GESP 5级', color: 'from-blue-500 to-blue-600', desc: '函数与递归' },
  6: { label: 'GESP 6级', color: 'from-violet-500 to-violet-600', desc: '复杂算法与数据结构' },
  7: { label: 'GESP 7级', color: 'from-purple-500 to-purple-600', desc: '高级算法' },
  8: { label: 'GESP 8级', color: 'from-rose-500 to-rose-600', desc: '竞赛进阶' },
}

export default function ProblemListPage() {
  const [levels, setLevels] = useState<LevelInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLevels()
  }, [])

  const loadLevels = async () => {
    setLoading(true)
    try {
      const res: any = await client.get('/problems')
      const counts: Record<number, number> = {}
      for (let i = 1; i <= 8; i++) counts[i] = 0
      for (const p of res) {
        if (p.gespLevel && p.gespLevel >= 1 && p.gespLevel <= 8) {
          counts[p.gespLevel] = (counts[p.gespLevel] || 0) + 1
        }
      }
      setLevels(Object.entries(counts).map(([level, count]) => ({ level: parseInt(level), count })))
    } catch (err) {
      console.error('加载等级失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Code2 className="w-7 h-7 text-primary-600" />
              题库
            </h1>
            <p className="text-sm text-gray-500 mt-1">按 GESP 等级选择题单</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">加载中...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {levels.map((item) => {
                const meta = levelMeta[item.level]
                return (
                  <Link
                    key={item.level}
                    to={`/student/problems/level/${item.level}`}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${meta.color}`}
                    />
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{meta.label}</h2>
                        <p className="mt-1 text-xs text-gray-500">{meta.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
