import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import client from '../api/client'
import Layout from '../components/Layout'

export default function ExamResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    client.get(`/exams/${id}/result`).then((res: any) => setResult(res)).catch(() => {})
  }, [id])

  if (!result) return <Layout><div className="p-6">加载中...</div></Layout>

  const exam = result.exam
  const results: Record<string, any> = result.results || {}
  const answers: Record<string, any> = result.answers || {}

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 text-center mb-6">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-4xl font-bold text-blue-600">{result.score}</div>
            <div className="text-gray-400 text-xl">/ {exam.totalScore}</div>
          </div>
          <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
            <Clock className="w-4 h-4" />
            {result.submittedAt
              ? `用时 ${Math.max(1, Math.round(((new Date(result.submittedAt).getTime() - new Date(result.startedAt).getTime()) / 1000 / 60)))} 分钟`
              : '考试进行中'}
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(results).map(([problemId, r]: [string, any]) => (
            <div key={problemId} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {r.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : r.status === '编译错误' ? (
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-bold">{r.status}</span>
                </div>
                <span className="font-bold text-blue-600">{r.score} 分</span>
              </div>
              {r.compileError && (
                <div className="mt-2 bg-red-50 text-red-700 p-2 rounded text-sm">
                  <strong>编译错误：</strong>{r.compileError}
                </div>
              )}
              {answers[problemId]?.code && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-500 cursor-pointer">查看代码</summary>
                  <pre className="mt-1 bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">{answers[problemId].code}</pre>
                </details>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/student/exams')}
          className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
        >
          返回考试列表
        </button>
      </div>
    </Layout>
  )
}
