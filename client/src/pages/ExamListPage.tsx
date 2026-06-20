import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Trophy, FileText, Plus, CheckCircle, Play } from 'lucide-react'
import client from '../api/client'

interface Exam {
  id: string
  title: string
  description: string
  duration: number
  totalScore: number
  gespLevel: number | null
  status: string
  createdAt: string
  _count?: { problems: number; studentExams?: number }
  participated?: boolean
  myScore?: number
  myStatus?: string | null
}

// 渐入动画 Hook
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function FadeInCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function ExamListPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('dkl_user') || '{}')
    setRole(user.role || 'student')
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      const res: any = await client.get('/exams')
      setExams(res)
    } catch (err) {
      console.error('加载考试失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== 页面标题区 ========== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-xs font-medium mb-3">
                <Trophy className="w-3.5 h-3.5" />
                检验学习成果
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                模拟考试
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                通过真实考题检验你的 C++ 编程能力，查漏补缺，为竞赛做好准备
              </p>
            </div>
            {role !== 'student' && (
              <button
                onClick={() => navigate('/teacher/exams/create')}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-cyan text-white rounded-xl font-medium text-sm shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                创建考试
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========== 考试列表 ========== */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-primary-300 border-t-primary-600 rounded-full" />
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">暂无考试</p>
            <p className="text-gray-400 text-sm mt-1">老师还没有发布考试哦~</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {exams.map((exam, idx) => {
              const isDone = exam.participated && exam.myStatus === 'submitted'
              const isDraft = exam.status === 'draft' && role !== 'student'
              return (
                <FadeInCard key={exam.id} delay={idx * 100}>
                  <div
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                    onClick={() => {
                      if (isDone) {
                        navigate(`/student/exams/${exam.id}/result`)
                      } else {
                        navigate(`/student/exams/${exam.id}`)
                      }
                    }}
                  >
                    {/* 顶部渐变条 */}
                    <div className="h-2 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-green" />

                    <div className="p-5">
                      {/* 标题行 */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-primary-600 transition-colors">
                            {exam.title}
                          </h3>
                          {exam.description && (
                            <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{exam.description}</p>
                          )}
                        </div>
                        {/* 状态徽章 */}
                        {isDone ? (
                          <span className="badge-green shrink-0 ml-3">
                            <CheckCircle className="w-3 h-3" />
                            {exam.myScore} 分
                          </span>
                        ) : isDraft ? (
                          <span className="badge-gray shrink-0 ml-3">草稿</span>
                        ) : exam.participated ? (
                          <span className="badge-blue shrink-0 ml-3">
                            <Play className="w-3 h-3" />
                            进行中
                          </span>
                        ) : (
                          <span className="badge-purple shrink-0 ml-3">
                            <Play className="w-3 h-3" />
                            去考试
                          </span>
                        )}
                      </div>

                      {/* 信息行 */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {exam.duration} 分钟
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-500">
                          <Trophy className="w-3.5 h-3.5" />
                          {exam.totalScore} 分
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-500">
                          <FileText className="w-3.5 h-3.5" />
                          {exam._count?.problems || 0} 道题
                        </span>
                        {exam.gespLevel && (
                          <span className="badge-gold text-xs">
                            GESP {exam.gespLevel} 级
                          </span>
                        )}
                      </div>

                      {/* 底部进度 / 按钮 */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        {isDone ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-accent-green" />
                            <span>已完成，点击查看详情</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>点击开始考试</span>
                          </div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                          <Play className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInCard>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
