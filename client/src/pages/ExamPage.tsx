import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import Editor from '@monaco-editor/react'
import client from '../api/client'
import Layout from '../components/Layout'

export default function ExamPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { code: string; language: string }>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [, setStartedAt] = useState<Date | null>(null)

  // 从 localStorage 恢复答案
  useEffect(() => {
    const saved = localStorage.getItem(`exam_${id}_answers`)
    if (saved) {
      try { setAnswers(JSON.parse(saved)) } catch {}
    }
  }, [id])

  // 答案变化时保存到 localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`exam_${id}_answers`, JSON.stringify(answers))
    }
  }, [answers, id])

  useEffect(() => {
    client.get(`/exams/${id}`).then((res: any) => {
      const data = res
      setExam(data)

      // 检查是否已开始过
      const se = data.studentExam
      if (se?.status === 'submitted') {
        alert('你已提交过该考试，将跳转到结果页')
        navigate(`/student/exams/${id}/result`)
        return
      }

      const startTime = se?.startedAt ? new Date(se.startedAt) : new Date()
      setStartedAt(startTime)

      // 计算剩余时间
      const elapsedSec = Math.floor((Date.now() - startTime.getTime()) / 1000)
      const remaining = Math.max(0, data.duration * 60 - elapsedSec)
      setTimeLeft(remaining)

      // 开始考试（如果还没开始）
      if (!se) {
        client.post(`/exams/${id}/start`)
      }

      // 初始化答案（如果没有恢复的数据）
      setAnswers(prev => {
        if (Object.keys(prev).length > 0) return prev
        const init: any = {}
        data.problems?.forEach((p: any) => {
          init[p.problem.id] = { code: p.problem.starterCode || '', language: 'C++' }
        })
        return init
      })
    }).catch(() => alert('考试加载失败'))
  }, [id, navigate])

  // 倒计时
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          // 时间到自动提交
          handleSubmitAuto()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSubmitAuto = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const currentAnswers = JSON.parse(localStorage.getItem(`exam_${id}_answers`) || '{}')
      await client.post(`/exams/${id}/submit`, { answers: currentAnswers })
      localStorage.removeItem(`exam_${id}_answers`)
      alert('考试时间到，已自动提交！')
      navigate(`/student/exams/${id}/result`)
    } catch {
      // 自动提交失败不做处理，避免弹窗干扰
    }
  }, [id, navigate, submitting])

  const formatTime = (s: number) => {
    if (s < 0) s = 0
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const currentProblem = exam?.problems?.[currentIndex]
  const problem = currentProblem?.problem

  const handleSubmit = async () => {
    if (!confirm('确定提交吗？提交后不可修改。')) return
    setSubmitting(true)
    try {
      await client.post(`/exams/${id}/submit`, { answers })
      localStorage.removeItem(`exam_${id}_answers`)
      alert('提交成功！')
      navigate(`/student/exams/${id}/result`)
    } catch (err: any) {
      alert(err.response?.data?.error || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (!exam || !problem) return <Layout><div className="p-6">加载中...</div></Layout>

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow p-4 mb-4">
          <div>
            <h1 className="font-bold text-lg">{exam.title}</h1>
            <p className="text-sm text-gray-500">第 {currentIndex + 1} / {exam.problems.length} 题</p>
          </div>
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 题面 */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="font-bold mb-2">{problem.title}</h2>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: problem.description }} />
            <div className="mt-4 text-sm">
              <p><strong>输入：</strong>{problem.inputDesc || '无'}</p>
              <p><strong>输出：</strong>{problem.outputDesc || '无'}</p>
              {problem.sampleInput !== undefined && (
                <div className="mt-2 bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">样例输入</p>
                  <pre className="text-sm">{problem.sampleInput}</pre>
                  <p className="text-xs text-gray-500 mt-1">样例输出</p>
                  <pre className="text-sm">{problem.sampleOutput}</pre>
                </div>
              )}
            </div>
          </div>

          {/* 编辑器 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow p-4 flex-1 min-h-[400px]">
              <Editor
                height="400px"
                language="cpp"
                theme="vs-light"
                value={answers[problem.id]?.code || ''}
                onChange={(value) => setAnswers(prev => ({ ...prev, [problem.id]: { ...prev[problem.id], code: value || '' } }))}
                options={{ fontSize: 16, minimap: { enabled: false } }}
              />
            </div>

            {/* 导航 */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow p-4">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => i - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" /> 上一题
              </button>

              <div className="flex gap-2">
                {exam.problems.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-8 h-8 rounded-full text-sm font-bold ${
                      i === currentIndex ? 'bg-blue-500 text-white' :
                      answers[exam.problems[i].problem.id]?.code ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentIndex < exam.problems.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(i => i + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  下一题 <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {submitting ? '提交中...' : '提交试卷'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
