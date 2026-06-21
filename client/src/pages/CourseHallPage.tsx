import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  Flame,
  Code,
  Trophy,
  Sparkles,
  User,
  LogOut,
  Star,
  Zap,
  Target,
  Rocket,
  Gem,
  Crown,
} from 'lucide-react'
import client from '../api/client'

interface Course {
  id: string
  title: string
  description: string | null
  levelMin: number
  levelMax: number
  progress: { completed: number; total: number; rate: number }
  chapters: { id: string; title: string; lessons: { id: string; title: string }[] }[]
}

interface UserStats {
  level: number
  experience: number
  streak: number
  weeklyCompleted: boolean
  completedLessons: number
  totalLessons: number
  nextLesson?: {
    id: string
    title: string
    chapter: {
      id: string
      title: string
      courseId: string
      course: { id: string; title: string }
    }
  } | null
}

// 根据 GESP 级别获取封面渐变类名
function getCoverClass(level: number): string {
  const map: Record<number, string> = {
    1: 'cover-gesp-1',
    2: 'cover-gesp-2',
    3: 'cover-gesp-3',
    4: 'cover-gesp-4',
    5: 'cover-gesp-5',
    6: 'cover-gesp-6',
    7: 'cover-gesp-7',
    8: 'cover-gesp-8',
  }
  return map[level] || 'cover-gesp-1'
}

// 渐入动画 Hook
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
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

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition ${
        active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

export default function CourseHallPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => location.pathname.startsWith(path)
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [coursesRes, statsRes]: [any, any] = await Promise.all([
        client.get('/courses'),
        client.get('/progress/stats'),
      ])
      setCourses(coursesRes || [])
      setStats(statsRes || null)
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('dkl_token')
    localStorage.removeItem('user')
    localStorage.removeItem('dkl_user')
    localStorage.removeItem('tenantId')
    localStorage.removeItem('dkl_tenantId')
    navigate('/login')
  }

  const handleStartWeeklyLesson = () => {
    if (stats?.nextLesson) {
      navigate(`/student/lessons/${stats.nextLesson.id}`)
    } else if (courses.length > 0) {
      navigate(`/student/courses/${courses[0].id}`)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好，小程序员！'
    if (hour < 18) return '下午好，小程序员！'
    return '晚上好，小程序员！'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="text-xl font-black text-blue-600 cursor-pointer flex items-center gap-2"
            onClick={() => navigate('/student/courses')}
          >
            <span className="text-2xl">🚀</span>
            DKL 编程
          </div>
          <div className="flex items-center gap-1">
            <NavButton
              icon={<BookOpen className="w-4 h-4" />}
              label="课程"
              active={isActive('/student/courses')}
              onClick={() => navigate('/student/courses')}
            />
            <NavButton
              icon={<Code className="w-4 h-4" />}
              label="题库"
              active={isActive('/student/problems')}
              onClick={() => navigate('/student/problems')}
            />
            <NavButton
              icon={<Trophy className="w-4 h-4" />}
              label="考试"
              active={isActive('/student/exams')}
              onClick={() => navigate('/student/exams')}
            />
            <NavButton
              icon={<User className="w-4 h-4" />}
              label="我的"
              active={isActive('/student/dashboard')}
              onClick={() => navigate('/student/dashboard')}
            />
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-lg"
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ========== 每周任务中心 Hero ========== */}
      <div className="hero-gradient relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-cyan/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-yellow-300/10 rounded-full blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* 左侧欢迎 + 本周状态 */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-white/90 text-sm mb-4">
                <Sparkles className="w-4 h-4 text-accent-gold" />
                {getGreeting()}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
                本周编程冒险
              </h1>
              <p className="text-white/80 text-lg max-w-md">
                {stats?.weeklyCompleted
                  ? '太棒了！本周任务已完成，去复习一下或者挑战更多题目吧～'
                  : '每周完成一课，连续坚持就能成为编程小达人！'}
              </p>
            </div>

            {/* 右侧任务卡 */}
            <div className="flex-shrink-0">
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-md">
                {/* 连胜显示 */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-3xl shadow-lg animate-pulse-soft">
                    <Flame className="w-8 h-8 text-white fill-current" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white">{stats?.streak || 0}</div>
                    <div className="text-white/70 text-sm font-medium">周连续学习 🔥</div>
                  </div>
                </div>

                {/* 本周状态条 */}
                <div className="bg-white/10 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm font-medium">本周任务</span>
                    <span className="text-white text-sm font-bold">
                      {stats?.weeklyCompleted ? '已完成' : '待完成'}
                    </span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        stats?.weeklyCompleted
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 w-full'
                          : 'bg-gradient-to-r from-primary-400 to-purple-400 w-1/3 animate-pulse'
                      }`}
                    />
                  </div>
                </div>

                {/* 开始按钮 */}
                <button
                  onClick={handleStartWeeklyLesson}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                    stats?.weeklyCompleted
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : 'bg-white text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {stats?.weeklyCompleted ? (
                    <>
                      <Rocket className="w-5 h-5" />
                      继续冒险
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      开始本周课程
                    </>
                  )}
                </button>

                {stats?.nextLesson && !stats?.weeklyCompleted && (
                  <p className="text-white/70 text-xs text-center mt-3">
                    下一课：{stats.nextLesson.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 个人状态条 ========== */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-black shadow-md">
              L{stats?.level || 1}
            </div>
            <div>
              <div className="text-sm text-gray-500">当前等级</div>
              <div className="font-bold text-gray-900">{stats?.experience || 0} XP</div>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-primary-600">
                <Star className="w-4 h-4 fill-current" />
                {stats?.completedLessons || 0}
              </div>
              <div className="text-xs text-gray-500">已完成课时</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-purple-600">
                <Gem className="w-4 h-4" />
                {stats?.totalLessons || 0}
              </div>
              <div className="text-xs text-gray-500">总课时</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-black text-orange-600">
                <Zap className="w-4 h-4 fill-current" />
                {stats?.streak || 0}
              </div>
              <div className="text-xs text-gray-500">周连胜</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 课程地图 ========== */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Crown className="w-6 h-6 text-accent-gold" />
          <h2 className="text-2xl font-black text-gray-900">课程地图</h2>
          <span className="text-gray-400 text-sm ml-2">选择你的冒险路线</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-300 border-t-primary-600 rounded-full" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">暂无课程</p>
            <p className="text-gray-400 text-sm mt-1">请联系老师添加课程</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => {
              const lessonCount = course.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0
              const isCompleted = course.progress?.rate === 100
              return (
                <FadeInCard key={course.id} delay={idx * 100}>
                  <div
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    {/* 封面色块 */}
                    <div className={`h-36 ${getCoverClass(course.levelMin)} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute top-3 right-3 w-16 h-16 bg-white/20 rounded-full blur-xl" />
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <span className="badge-gold text-xs">
                          <Trophy className="w-3 h-3" />
                          GESP {course.levelMin}-{course.levelMax} 级
                        </span>
                        {isCompleted && (
                          <span className="badge-green text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            已通关
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 内容 */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                        {course.description || '暂无描述'}
                      </p>

                      {/* 进度条 */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                          <span>进度</span>
                          <span className="font-medium text-primary-600">
                            {course.progress?.completed || 0}/{lessonCount} 课
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-400 to-purple-500 rounded-full transition-all duration-700"
                            style={{ width: `${course.progress?.rate || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.chapters?.length || 0} 章节
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            {lessonCount} 课时
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
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
