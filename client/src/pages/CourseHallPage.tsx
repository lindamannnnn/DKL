import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  Flame,
  Sparkles,
  Star,
  Zap,
  Target,
  Rocket,
  Gem,
  Compass,
  Map,
  Scroll,
  Flag,
  Lock,
  BookOpenCheck,
} from 'lucide-react'
import GuildNav from '../components/GuildNav'
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

// 关卡地形与主题
interface LevelTheme {
  name: string
  emoji: string
  badge: string
  primary: string
  secondary: string
  accent: string
}

const LEVEL_THEMES: Record<number, LevelTheme> = {
  1: { name: '青青草原', emoji: '🌱', badge: '起步营地', primary: 'from-blue-500 to-cyan-400', secondary: 'bg-blue-500', accent: 'text-blue-400' },
  2: { name: '炽热沙漠', emoji: '🌵', badge: '沙漠驿站', primary: 'from-emerald-500 to-teal-400', secondary: 'bg-emerald-500', accent: 'text-emerald-400' },
  3: { name: '迷雾森林', emoji: '🌲', badge: '森林入口', primary: 'from-violet-500 to-purple-400', secondary: 'bg-violet-500', accent: 'text-violet-400' },
  4: { name: '冰封雪山', emoji: '⛄', badge: '雪山营地', primary: 'from-amber-500 to-orange-400', secondary: 'bg-amber-500', accent: 'text-amber-400' },
  5: { name: '熔岩火山', emoji: '🌋', badge: '火山哨站', primary: 'from-rose-500 to-pink-400', secondary: 'bg-rose-500', accent: 'text-rose-400' },
  6: { name: '剧毒沼泽', emoji: '🐊', badge: '沼泽据点', primary: 'from-indigo-500 to-blue-400', secondary: 'bg-indigo-500', accent: 'text-indigo-400' },
  7: { name: '幽暗深渊', emoji: '💎', badge: '深渊前哨', primary: 'from-red-500 to-orange-400', secondary: 'bg-red-500', accent: 'text-red-400' },
  8: { name: '星河城堡', emoji: '🏰', badge: '终极城堡', primary: 'from-slate-500 to-gray-400', secondary: 'bg-slate-500', accent: 'text-slate-400' },
}

function getLevelTheme(level: number): LevelTheme {
  return LEVEL_THEMES[level] || LEVEL_THEMES[1]
}

function getCoverStyle(level: number): React.CSSProperties {
  return {
    backgroundImage: `url('/maps/map-level-${level}.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
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

export default function CourseHallPage() {
  const navigate = useNavigate()
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
      const sortedCourses = (coursesRes || []).sort((a: Course, b: Course) => a.levelMin - b.levelMin)
      setCourses(sortedCourses)
      setStats(statsRes || null)
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      setLoading(false)
    }
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
    if (hour < 12) return '早上好，冒险家！'
    if (hour < 18) return '下午好，冒险家！'
    return '晚上好，冒险家！'
  }

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

      {/* 顶部导航栏：木质冒险者公会风格（共享组件） */}
      <GuildNav />

      {/* ========== 冒险者公会任务板 Hero ========== */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* 左侧：欢迎与任务宣言 */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 text-sm font-bold mb-4 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                {getGreeting()}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                本周冒险任务
              </h1>
              <p className="text-amber-100/70 text-lg max-w-md leading-relaxed">
                {stats?.weeklyCompleted
                  ? '本周任务已完成！去征服更多关卡，收集稀有宝藏吧！'
                  : '每周完成一课，连续坚持就能解锁更强大的编程技能！'}
              </p>

              {/* 快速数据徽章 */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl">
                  <Flame className="w-5 h-5 text-orange-500 fill-current" />
                  <span className="font-bold text-white">{stats?.streak || 0}</span>
                  <span className="text-slate-400 text-sm">周连胜</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-white">{stats?.completedLessons || 0}</span>
                  <span className="text-slate-400 text-sm">已征服课时</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-xl">
                  <Zap className="w-5 h-5 text-amber-500 fill-current" />
                  <span className="font-bold text-white">{stats?.experience || 0}</span>
                  <span className="text-slate-400 text-sm">XP</span>
                </div>
              </div>
            </div>

            {/* 右侧：悬赏任务卷轴 */}
            <div className="flex-shrink-0 w-full max-w-md">
              <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-1 shadow-[0_8px_32px_rgba(251,191,11,0.25)]">
                {/* 卷轴两端 */}
                <div className="absolute -left-2 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-700 to-amber-600 rounded-l-full shadow-lg" />
                <div className="absolute -right-2 top-0 bottom-0 w-4 bg-gradient-to-l from-amber-700 to-amber-600 rounded-r-full shadow-lg" />

                <div className="bg-[#fff8e7] rounded-xl p-6 relative overflow-hidden">
                  {/* 羊皮纸纹理 */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <Scroll className="w-5 h-5 text-amber-700" />
                      <span className="text-amber-900 font-black text-lg tracking-wide">本周悬赏</span>
                    </div>

                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl shadow-lg">
                        <Flame className="w-7 h-7 text-white fill-current" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-amber-900">{stats?.streak || 0}</div>
                        <div className="text-amber-700/70 text-sm font-bold">周连续学习 🔥</div>
                      </div>
                    </div>

                    <div className="bg-amber-900/5 rounded-xl p-4 mb-5 border border-amber-900/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-800 text-sm font-bold">任务进度</span>
                        <span className="text-amber-900 text-sm font-black">
                          {stats?.weeklyCompleted ? '已完成' : '待完成'}
                        </span>
                      </div>
                      <div className="h-3 bg-amber-900/10 rounded-full overflow-hidden border border-amber-900/10">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            stats?.weeklyCompleted
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-full'
                              : 'bg-gradient-to-r from-primary-500 to-purple-500 w-1/3 animate-pulse'
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleStartWeeklyLesson}
                      disabled={loading}
                      className={`w-full py-3.5 rounded-xl font-black text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                        stats?.weeklyCompleted
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-500 hover:to-purple-500'
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
                          开始本周任务
                        </>
                      )}
                    </button>

                    {stats?.nextLesson && !stats?.weeklyCompleted && (
                      <p className="text-amber-700/70 text-xs text-center mt-3 font-medium">
                        下一关：{stats.nextLesson.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 冒险者状态面板 ========== */}
      <div className="max-w-6xl mx-auto px-4 -mt-2 relative z-10">
        <div className="bg-slate-900/80 border-2 border-amber-500/30 rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_24px_rgba(251,191,11,0.1)] backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-black shadow-lg border-2 border-yellow-300">
              L{stats?.level || 1}
            </div>
            <div>
              <div className="text-sm text-amber-200/70 font-bold">冒险者等级</div>
              <div className="font-black text-white text-lg">{stats?.experience || 0} XP</div>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xl font-black text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                {stats?.completedLessons || 0}
              </div>
              <div className="text-xs text-slate-400 font-bold">已征服</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xl font-black text-purple-400">
                <Gem className="w-5 h-5" />
                {stats?.totalLessons || 0}
              </div>
              <div className="text-xs text-slate-400 font-bold">总关卡</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xl font-black text-orange-400">
                <Flame className="w-5 h-5 fill-current" />
                {stats?.streak || 0}
              </div>
              <div className="text-xs text-slate-400 font-bold">连胜</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 智慧书库入口（知识快查） ========== */}
      <div className="max-w-6xl mx-auto px-4 mt-6 relative z-10">
        <FadeInCard>
          <div
            role="button"
            tabIndex={0}
            aria-label="进入智慧书库，搜索 GESP 知识答案"
            className="group relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/60 cursor-pointer transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_0_40px_rgba(251,191,11,0.25)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            onClick={() => navigate('/student/knowledge')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate('/student/knowledge')
              }
            }}
          >
            {/* 羊皮纸纹理衬底 */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              }}
            />
            {/* 发光精灵点缀 */}
            <div className="absolute top-1/2 -translate-y-1/2 right-8 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 p-6 md:p-7">
              {/* 书库徽章 */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,11,0.45)] border border-amber-300/50">
                  <BookOpenCheck className="w-8 h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 text-xs font-black tracking-wider">
                      公会藏书阁
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-md">
                    智慧书库
                  </h2>
                </div>
              </div>

              {/* 文案 + 行动按钮 */}
              <div className="flex-1 sm:text-left">
                <p className="text-amber-100/70 text-sm md:text-base leading-relaxed">
                  冒险路上遇到难题？打开智慧书库，快速搜索全部知识，
                  <span className="text-amber-300 font-bold">让 AI 向导带你解开谜题</span>，继续前进！
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden lg:inline text-amber-300/70 text-sm font-bold">
                  检索 GESP 1-8 级
                </span>
                <span className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-lg transition-all group-hover:scale-[1.03] active:scale-[0.97]">
                  去查答案
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </FadeInCard>
      </div>

      {/* ========== 课程地图 ========== */}
      <main className="max-w-6xl mx-auto px-4 py-10 relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">冒险地图</h2>
            <p className="text-amber-200/50 text-sm font-medium">选择你的冒险路线，征服所有关卡</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Map className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg font-bold">暂无冒险区域</p>
            <p className="text-slate-500 text-sm mt-1">请联系公会管理员添加关卡</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => {
              const lessonCount = course.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0
              const isCompleted = course.progress?.rate === 100
              const isLocked = course.progress?.rate === 0 && lessonCount === 0
              const theme = getLevelTheme(course.levelMin)

              return (
                <FadeInCard key={course.id} delay={idx * 100}>
                  <div
                    className="group relative bg-slate-900 rounded-2xl border-2 border-slate-700 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-[0_12px_40px_rgba(251,191,11,0.2)]"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  >
                    {/* 封面背景：关卡地图 */}
                    <div className="h-40 relative overflow-hidden" style={getCoverStyle(course.levelMin)}>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                      <div className="absolute inset-0 bg-black/20" />

                      {/* 顶部角标 */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur text-amber-300 text-xs font-black rounded-lg border border-amber-500/30">
                          {theme.badge}
                        </span>
                      </div>


                      {/* 底部标题区 */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{theme.emoji}</span>
                          <span className="text-white/80 text-xs font-bold">{theme.name}</span>
                        </div>
                        <h3 className="font-black text-white text-lg line-clamp-1 drop-shadow-md">
                          {course.title}
                        </h3>
                      </div>

                      {/* 通关彩带 */}
                      {isCompleted && (
                        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                          <div className="absolute top-2 right-2 w-28 h-6 bg-gradient-to-r from-yellow-500 to-amber-500 rotate-45 translate-x-6 -translate-y-1 flex items-center justify-center text-[10px] font-black text-yellow-950 shadow-lg">
                            已通关
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="p-5">
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                        {course.description || '暂无描述'}
                      </p>

                      {/* 进度条 */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                          <span className="font-bold">征服进度</span>
                          <span className={`font-black ${theme.accent}`}>
                            {course.progress?.completed || 0}/{lessonCount} 关
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-700`}
                            style={{ width: `${course.progress?.rate || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.chapters?.length || 0} 章节
                          </span>
                          <span className="flex items-center gap-1">
                            <Flag className="w-4 h-4" />
                            {lessonCount} 关卡
                          </span>
                        </div>
                        <div className={`w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center transition-all group-hover:bg-gradient-to-r ${theme.primary} group-hover:text-white border border-slate-700 group-hover:border-transparent`}>
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                          )}
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

      {/* 底部装饰 */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>更多冒险区域正在探索中……</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
      </div>
    </div>
  )
}
