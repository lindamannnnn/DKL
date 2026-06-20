import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import client from '../../api/client'

interface Problem {
  id: string
  title: string
  difficulty: string
  gespLevel: number | null
  tags: string[]
}

export default function TeacherProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => { loadProblems() }, [])

  const loadProblems = async () => {
    try { const res: any = await client.get('/problems'); setProblems(res) }
    catch (err) { console.error('加载题目失败:', err) }
  }

  const filtered = problems.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">题库管理</h1>
        <button className="flex items-center btn-primary text-sm">
          <Plus className="w-4 h-4 mr-2" />新建题目
        </button>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索题目..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">题目</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">级别</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">难度</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">标签</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem) => (
              <tr key={problem.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{problem.title}</td>
                <td className="px-4 py-3">{problem.gespLevel ? `GESP ${problem.gespLevel}级` : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    problem.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                    problem.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {problem.difficulty === 'easy' ? '入门' : problem.difficulty === 'medium' ? '简单' : '中等'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
