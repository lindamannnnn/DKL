import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, ChevronRight, Flame, Code, Trophy, Sparkles, User, LogOut } from 'lucide-react'
import client from '../api/client'

interface Course {
  id: string
  title: string
  description: string | null
  levelMin: number
  levelMax: number
  chapters: { id: string; title: string; lessons: { id: string; title: string }[] }[]
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

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
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
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ courses: 0, problems: 0, streak: 0 })

  useEffect(() => {
    loadCourses()
    // 尝试加载学习报告获取真实统计
    client.get('/progress/report').then((res: any) => {
      if (res.summary) {
        setStats({
          courses: res.summary.completedLessons || 0,
          problems: res.summary.acceptedSubmissions || 0,
          streak: res.summary.streak || 0,
        })
      }
    }).catch(() => {
      // fallback 静态数据
      setStats({ courses: 2, problems: 3, streak: 1 })
    })
  }, [])

  const loadCourses = async () => {
    try {
      const res: any = await client.get('/courses')
      setCourses(res)
    } catch (err) {
      console.error('加载课程失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('dkl_token')
    localStorage.removeItem('dkl_user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="text-xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate('/student/courses')}
          >
            DKL 编程
          </div>
          <div className="flex items-center gap-1">
            <NavButton icon={<BookOpen className="w-4 h-4" />} label="课程" active={isActive('/student/courses')} onClick={() => navigate('/student/courses')} />
            <NavButton icon={<Code className="w-4 h-4" />} label="题库" active={isActive('/student/problems')} onClick={() => navigate('/student/problems')} />
            <NavButton icon={<Trophy className="w-4 h-4" />} label="考试" active={isActive('/student/exams')} onClick={() => navigate('/student/exams')} />
            <NavButton icon={<User className="w-4 h-4" />} label="我的" active={isActive('/student/dashboard')} onClick={() => navigate('/student/dashboard')} />
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

      {/* ========== Hero 区域 ========== */}
      <div className="hero-gradient relative overflow-hidden">
        {/* 装饰圆 */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-cyan/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-white/90 text-sm mb-4">
                <Sparkles className="w-4 h-4 text-accent-gold" />
                探索 C++ 编程世界
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                课程大厅
              </h1>
              <p className="text-white/70 text-lg max-w-md">
                从 GESP 1 级到 8 级，系统化学习 C++ 编程，为信奥竞赛打下坚实基础
              </p>
            </div>

            {/* 统计卡片 */}
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.courses}</div>
                <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> 已完成课时
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.problems}</div>
                <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <Code className="w-3 h-3" /> AC 题目
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-5 py-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-accent-gold">{stats.streak}</div>
                <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-accent-gold" /> 连续打卡
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 课程列表 ========== */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-primary-300 border-t-primary-600 rounded-full" />
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
              return (
                <FadeInCard key={course.id} delay={idx * 100}>
                  <div
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    {/* 封面色块 */}
                    <div className={`h-36 ${getCoverClass(course.levelMin)} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/5" />
                      {/* 装饰图案 */}
                      <div className="absolute top-3 right-3 w-16 h-16 bg-white/20 rounded-full blur-xl" />
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        <span className="badge-gold text-xs">
                          <Trophy className="w-3 h-3" />
                          GESP {course.levelMin}-{course.levelMax} 级
                        </span>
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
