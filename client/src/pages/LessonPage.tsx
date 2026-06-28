import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  MessageCircle,
  BookOpen,
  CheckCircle2,
  Star,
  Copy,
  Check,
  Sparkles,
  Zap,
  Lightbulb,
  Trophy,
  Target,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import client from '../api/client'
import ProblemPracticeBlock from '../components/ProblemPracticeBlock'
import CelebrationModal from '../components/CelebrationModal'
import BadgeToast from '../components/BadgeToast'
import XPGain from '../components/XPGain'
import AICoachPanel from '../components/AICoachPanel'

interface LessonPageData {
  title: string
  blocks: any[]
  hasCheckpoint: boolean
}

interface LessonData {
  id: string
  title: string
  content: any[] | null
  rawMarkdown: string | null
  pages: LessonPageData[]
  xpReward: number
  chapter: {
    title: string
    course: { title: string; id: string }
    lessons: { id: string; title: string }[]
  }
  progress: { status: string } | null
}

interface Reward {
  xp: number
  levelUp: boolean
  newLevel?: number
  badges: { id: string; name: string; icon: string; description: string }[]
  streak: number
  weeklyCompleted: boolean
}

const LS_PAGE_KEY = 'dkl-lesson-page'

function getStoredPage(lessonId?: string): number {
  if (!lessonId) return 0
  try {
    const raw = localStorage.getItem(LS_PAGE_KEY)
    if (!raw) return 0
    const map = JSON.parse(raw)
    return typeof map[lessonId] === 'number' ? map[lessonId] : 0
  } catch {
    return 0
  }
}

function storePage(lessonId: string, page: number) {
  try {
    const raw = localStorage.getItem(LS_PAGE_KEY)
    const map = raw ? JSON.parse(raw) : {}
    map[lessonId] = page
    localStorage.setItem(LS_PAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

// 把 blocks 按 heading 分成若干"概念组"，每组作为一个卡片逐步揭示。
// heading 会与后续普通 markdown 合并；若 heading 后紧跟特殊块，也合并到同一张卡片。
function groupBlocks(blocks: any[]): any[][] {
  const groups: any[][] = []
  let current: any[] = []
  let pendingHeading: any | null = null

  const flushCurrent = () => {
    if (current.length > 0) {
      groups.push(current)
      current = []
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const isHeadingMarkdown = block.type === 'markdown' && /^#{1,3}\s/.test(block.content.trim())

    if (isHeadingMarkdown) {
      flushCurrent()
      if (pendingHeading) groups.push([pendingHeading])
      pendingHeading = block
      continue
    }

    if (pendingHeading) {
      // heading 后面是普通 markdown：合并为同一组
      if (block.type === 'markdown') {
        current = [pendingHeading, block]
        pendingHeading = null
      } else {
        // heading 后面是特殊块：把 heading 和特殊块放在同组
        groups.push([pendingHeading, block])
        pendingHeading = null
      }
      continue
    }

    if (block.type === 'markdown' && current.length > 0 && /^#{1,3}\s/.test(current[0].content.trim())) {
      // heading 后面的普通 markdown 继续合并
      current.push(block)
    } else {
      // 普通 markdown 连续合并；特殊类型单独成组
      if (current.length > 0 && current[0].type === 'markdown' && block.type === 'markdown') {
        current.push(block)
      } else {
        flushCurrent()
        current = [block]
      }
    }
  }

  if (pendingHeading) {
    groups.push([pendingHeading])
  }
  if (current.length > 0) {
    groups.push(current)
  }

  return groups
}

// 简单音效（使用 Web Audio API，无需外部文件）
function playSound(type: 'correct' | 'wrong' | 'reveal' | 'complete' | 'click') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    switch (type) {
      case 'correct':
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
        break
      case 'wrong':
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, ctx.currentTime)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
        break
      case 'reveal':
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.2, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
        break
      case 'complete':
        osc.type = 'sine'
        ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.connect(g)
          g.connect(ctx.destination)
          o.frequency.value = freq
          g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
          g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.05)
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.4)
          o.start(ctx.currentTime + i * 0.12)
          o.stop(ctx.currentTime + i * 0.12 + 0.4)
        })
        break
      case 'click':
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
        osc.start()
        osc.stop(ctx.currentTime + 0.08)
        break
    }
  } catch {
    // ignore
  }
}

// 提取可朗读的纯文本
function extractText(content: string): string {
  return content
    .replace(/#{1,3}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim()
}

export default function LessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [completedReward, setCompletedReward] = useState<Reward | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [xpGain, setXpGain] = useState<number | null>(null)
  const [newBadges, setNewBadges] = useState<{ id: string; name: string; icon: string; description: string }[]>([])
  const [combo, setCombo] = useState(0)
  const [pageXP, setPageXP] = useState(0)
  const [milestone, setMilestone] = useState<string | null>(null)
  const [revealedMap, setRevealedMap] = useState<Record<number, number>>({})

  useEffect(() => {
    if (id) {
      setCurrentPage(getStoredPage(id))
      setRevealedMap({})
      setCombo(0)
      setPageXP(0)
    }
  }, [id])

  useEffect(() => {
    if (id) loadLesson()
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
    // 每翻到新一页，重置本页 XP 计数
    setPageXP(0)
  }, [currentPage])

  useEffect(() => {
    if (id) storePage(id, currentPage)
  }, [id, currentPage])

  const loadLesson = async () => {
    setLoading(true)
    try {
      const res: any = await client.get(`/lessons/${id}`)
      setLesson(res)
    } catch (err) {
      console.error('加载课时失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const pages = lesson?.pages?.length ? lesson.pages : [{ title: lesson?.title || '', blocks: lesson?.content || [], hasCheckpoint: false }]
  const page = pages[currentPage]
  const totalPages = pages.length
  const isCompleted = lesson?.progress?.status === 'completed'

  const currentLessonIndex = lesson?.chapter.lessons.findIndex((l) => l.id === id) ?? -1
  const nextLesson = lesson && currentLessonIndex < lesson.chapter.lessons.length - 1 ? lesson.chapter.lessons[currentLessonIndex + 1] : null

  const groups = page?.blocks?.length ? groupBlocks(page.blocks) : []
  const revealedCount = isCompleted
    ? groups.length
    : revealedMap[currentPage] ?? Math.min(1, groups.length)
  const allRevealed = groups.length ? revealedCount >= groups.length : true

  const revealNext = () => {
    if (!groups.length) return
    const next = Math.min((revealedMap[currentPage] ?? 1) + 1, groups.length)
    setRevealedMap((prev) => ({ ...prev, [currentPage]: next }))
    setXpGain(2)
    setPageXP((p) => p + 2)
    playSound('reveal')
    if (next === groups.length) {
      playSound('complete')
      showMilestone('🎉 本页学完啦！')
    } else if (next === Math.ceil(groups.length / 2)) {
      showMilestone('⛽ 已经学一半了，继续加油！')
    }
  }

  const showMilestone = (text: string) => {
    setMilestone(text)
    setTimeout(() => setMilestone(null), 2500)
  }

  const handleComplete = async () => {
    if (!lesson) return
    try {
      const res: any = await client.post(`/lessons/${id}/complete`)
      const badges = res.newBadges || []
      setCompletedReward({
        xp: res.xpGained || lesson.xpReward || 10,
        levelUp: res.levelUp || false,
        newLevel: res.newLevel,
        badges,
        streak: res.streak || 0,
        weeklyCompleted: res.weeklyCompleted || false,
      })
      if (badges.length > 0) setNewBadges(badges)
      setShowCelebration(true)
      loadLesson()
    } catch (err) {
      console.error('标记完成失败:', err)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1)
    }
  }

  const handleCheckpointPass = () => {
    setXpGain(5)
    setPageXP((p) => p + 5)
    playSound('correct')
    setCombo((c) => {
      const next = c + 1
      if (next >= 3) {
        playSound('complete')
        showMilestone(`🔥 连续答对 ${next} 题！`)
      }
      return next
    })
  }

  const handleQuizCorrect = () => {
    setXpGain(3)
    setPageXP((p) => p + 3)
    playSound('correct')
    setCombo((c) => {
      const next = c + 1
      if (next >= 3) {
        playSound('complete')
        showMilestone(`🔥 连续答对 ${next} 题！`)
      }
      return next
    })
  }

  const handleWrongAnswer = () => {
    setCombo(0)
    playSound('wrong')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <div className="text-gray-500 font-medium">加载中...</div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-gray-500">课时不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* 左侧目录 */}
      <aside className="w-72 bg-white/80 backdrop-blur border-r border-gray-200 flex-shrink-0 hidden lg:block">
        <div className="p-5 border-b border-gray-200">
          <button
            onClick={() => navigate(`/student/courses/${lesson.chapter.course.id}`)}
            className="flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {lesson.chapter.course.title}
          </button>
          <h2 className="font-bold text-gray-900 mt-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            {lesson.chapter.title}
          </h2>
        </div>
        <nav className="p-3 space-y-1">
          {lesson.chapter.lessons.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => navigate(`/student/lessons/${l.id}`)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                l.id === id
                  ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-gray-400 mr-2">{idx + 1}.</span>
              {l.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* 顶部栏 */}
        <div className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <h1 className="text-lg font-bold text-gray-900 truncate">{lesson.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                {combo >= 2 && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold animate-pulse">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {combo}
                  </span>
                )}
                {pageXP > 0 && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    +{pageXP}
                  </span>
                )}
                {lesson.progress?.status === 'completed' ? (
                  <span className="text-sm text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    已完成
                  </span>
                ) : null}
              </div>
            </div>
            {/* 星星进度轨道 */}
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const isPast = i < currentPage
                const isCurrent = i === currentPage
                const circle = (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-yellow-400 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-primary-500 text-white ring-4 ring-primary-100 scale-110'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isPast ? <Star className="w-3.5 h-3.5 fill-current" /> : i + 1}
                  </div>
                )

                return (
                  <div key={i}>
                    {isCompleted ? (
                      <button
                        onClick={() => setCurrentPage(i)}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-full"
                        title={`跳到第 ${i + 1} 关`}
                      >
                        {circle}
                      </button>
                    ) : (
                      circle
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 幻灯片页面 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[calc(100vh-260px)] p-5 md:p-8 lg:p-10">
              {/* 页面标题：关卡风格 */}
              <div className="mb-6 md:mb-8 pb-5 md:pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-bold text-primary-600 mb-2">
                  <Sparkles className="w-4 h-4" />
                  关卡 {currentPage + 1} / {totalPages}
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 flex items-center gap-3">
                  <span className="text-3xl md:text-4xl">🎯</span>
                  {page.title}
                </h2>
              </div>

              {/* 页面内容：按概念组逐步揭示 */}
              <div className="space-y-4 md:space-y-5">
                {(() => {
                  const problemBlocks = page.blocks.filter((b: any) => b.type === 'problem' && b.metadata?.problemId)
                  if (problemBlocks.length > 0) {
                    return (
                      <div className="animate-fade-in-up">
                        <ProblemPracticeBlock
                          problemIds={problemBlocks.map((b: any) => b.metadata.problemId)}
                          lessonId={lesson.id}
                        />
                      </div>
                    )
                  }
                  return groups.slice(0, revealedCount).map((group: any[], gidx: number) => (
                    <div
                      key={`${currentPage}-g${gidx}`}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(gidx * 80, 320)}ms` }}
                    >
                      <ConceptCard
                        group={group}
                        lessonId={lesson.id}
                        onCheckpointPass={handleCheckpointPass}
                        onQuizCorrect={handleQuizCorrect}
                        onWrongAnswer={handleWrongAnswer}
                      />
                    </div>
                  ))
                })()}
              </div>

              {/* 继续揭示按钮 */}
              {!allRevealed && (
                <div className="mt-8 md:mt-10 flex justify-center animate-fade-in-up">
                  <button
                    onClick={revealNext}
                    className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-primary-300/40 hover:shadow-xl hover:shadow-primary-300/50 hover:scale-105 transition-all"
                  >
                    <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    继续冒险
                    <span className="text-xs font-normal text-white/80 ml-1">
                      还有 {groups.length - revealedCount} 关
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* 页面底部导航 */}
              <div className="mt-10 md:mt-12 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center px-5 py-3 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  上一关
                </button>

                {currentPage < totalPages - 1 ? (
                  <button
                    onClick={handleNextPage}
                    disabled={!allRevealed}
                    className={`flex items-center px-7 py-3.5 rounded-2xl font-black text-lg shadow-md transition-all ${
                      allRevealed
                        ? 'bg-gradient-to-r from-success to-emerald-400 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {allRevealed ? '下一关' : '先学完当前内容'}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={lesson.progress?.status === 'completed' ? () => nextLesson && navigate(`/student/lessons/${nextLesson.id}`) : handleComplete}
                    disabled={!allRevealed}
                    className={`flex items-center px-7 py-3.5 rounded-2xl font-black text-lg shadow-md transition-all ${
                      allRevealed
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {lesson.progress?.status === 'completed' ? (nextLesson ? '下一课 🏆' : '已完成') : '完成挑战 🏆'}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI 教练浮动按钮 */}
      <button
        onClick={() => setShowAI(!showAI)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* AI 教练面板 */}
      {showAI && <AICoachPanel lessonId={lesson.id} onClose={() => setShowAI(false)} />}

      {/* 庆祝弹窗 */}
      {showCelebration && completedReward && (
        <CelebrationModal
          title="本课完成！🎉"
          subtitle="你太棒啦，继续加油！"
          reward={completedReward}
          streak={completedReward.streak}
          weeklyCompleted={completedReward.weeklyCompleted}
          nextLessonTitle={nextLesson?.title || null}
          nextText={nextLesson ? '下一课' : '去个人中心'}
          onNext={() => {
            setShowCelebration(false)
            if (nextLesson) {
              navigate(`/student/lessons/${nextLesson.id}`)
            } else {
              navigate('/student/dashboard')
            }
          }}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* 徽章 Toast */}
      {newBadges.length > 0 && <BadgeToast badges={newBadges} onClose={() => setNewBadges([])} />}

      {/* 经验飘字 */}
      {xpGain !== null && <XPGain amount={xpGain} onDone={() => setXpGain(null)} />}

      {/* 里程碑提示 */}
      {milestone && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in-up">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-full shadow-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {milestone}
          </div>
        </div>
      )}
    </div>
  )
}

// 概念卡片：一组相关的 blocks 包裹在一个卡片中逐步揭示
function ConceptCard({
  group,
  lessonId,
  onCheckpointPass,
  onQuizCorrect,
  onWrongAnswer,
}: {
  group: any[]
  lessonId?: string
  onCheckpointPass?: () => void
  onQuizCorrect?: () => void
  onWrongAnswer?: () => void
}) {
  const [speaking, setSpeaking] = useState(false)
  const speakText = group.map((b) => extractText(b.content || '')).join('，').slice(0, 220)

  const toggleSpeak = () => {
    if (!('speechSynthesis' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      const utter = new SpeechSynthesisUtterance(speakText)
      utter.lang = 'zh-CN'
      utter.rate = 0.95
      utter.pitch = 1.05
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utter)
      setSpeaking(true)
    }
  }

  // markdown 概念组：卡片 + 语音朗读按钮
  const isMarkdownGroup = !(group.length === 1 && group[0].type !== 'markdown')

  return (
    <div className="rounded-3xl border-2 border-primary-100 shadow-lg shadow-primary-100/30 overflow-hidden bg-white">
      <div className="h-2 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400" />
      <div className="p-5 md:p-6 lg:p-7 relative">
        {isMarkdownGroup && (
          <button
            onClick={toggleSpeak}
            className={`absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 ${
              speaking
                ? 'bg-primary-500 text-white shadow-glow-blue animate-pulse'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 shadow-sm'
            }`}
            title={speaking ? '停止朗读' : '读给我听'}
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
        {group.map((block, idx) => (
          <div key={idx} className={idx > 0 ? 'mt-3' : ''}>
            <ContentBlock
              block={block}
              lessonId={lessonId}
              onCheckpointPass={onCheckpointPass}
              onQuizCorrect={onQuizCorrect}
              onWrongAnswer={onWrongAnswer}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// 内容块渲染
function ContentBlock({
  block,
  lessonId,
  onCheckpointPass,
  onQuizCorrect,
  onWrongAnswer,
}: {
  block: any
  lessonId?: string
  onCheckpointPass?: () => void
  onQuizCorrect?: () => void
  onWrongAnswer?: () => void
}) {
  const navigate = useNavigate()

  switch (block.type) {
    case 'markdown':
      return (
        <div className="lesson-content lesson-content-paged py-2 md:py-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {block.content}
          </ReactMarkdown>
        </div>
      )

    case 'story':
      return (
        <div className="p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-4xl animate-float">📖</span>
            <div className="text-gray-700 leading-relaxed text-lg lesson-content-paged flex-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {block.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )

    case 'card': {
      const cardType = block.metadata?.type || 'teacher'
      const icons: Record<string, string> = {
        teacher: '🧑‍🏫',
        computer: '🖥️',
        tip: '💡',
      }
      const bgColors: Record<string, string> = {
        teacher: 'bg-blue-50 border-blue-100',
        computer: 'bg-green-50 border-green-100',
        tip: 'bg-amber-50 border-amber-100',
      }
      return (
        <div className={`p-6 rounded-3xl border shadow-sm ${bgColors[cardType] || bgColors.teacher}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">{icons[cardType] || icons.teacher}</span>
            <div className="text-gray-800 leading-relaxed text-lg lesson-content-paged flex-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {block.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )
    }

    case 'demo':
      return <CodeBlock code={block.content} language={block.language || 'cpp'} runnable />

    case 'checkpoint':
      return (
        <div className="p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl border-2 border-primary-200 shadow-sm">
          <h4 className="font-bold text-primary-800 mb-2 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm">
              <Target className="w-4 h-4" />
            </span>
            小挑战
            <span className="ml-auto text-xs font-normal text-primary-600 bg-white px-2 py-1 rounded-full border border-primary-100">
              +5 XP
            </span>
          </h4>
          <p className="text-sm text-primary-700/70 mb-4">答对就能点亮下一颗知识星星 ✨</p>
          {block.metadata?.quiz && (
            <QuizBlock block={block.metadata.quiz} mode="checkpoint" onCorrect={onCheckpointPass} onWrong={onWrongAnswer} />
          )}
        </div>
      )

    case 'code':
      return <CodeBlock code={block.content} language={block.language || 'cpp'} runnable={!!block.metadata?.runnable} />

    case 'quiz':
      return (
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 shadow-sm">
          <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm">
              <Lightbulb className="w-4 h-4" />
            </span>
            练一练
            <span className="ml-auto text-xs font-normal text-indigo-600 bg-white px-2 py-1 rounded-full border border-indigo-100">
              +3 XP
            </span>
          </h4>
          <QuizBlock block={block} onCorrect={onQuizCorrect} onWrong={onWrongAnswer} />
        </div>
      )

    case 'problem':
      return (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
          <button
            onClick={() => navigate(`/student/problems/${block.metadata?.problemId}?lessonId=${lessonId}`)}
            className="w-full text-amber-800 font-bold hover:text-amber-900 transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            去做课后编程题
          </button>
        </div>
      )

    case 'hint':
      return <HintBlock content={block.content} />

    case 'coach-tip':
      return (
        <div className="p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="lesson-content-paged flex-1">
              <p className="text-sm font-bold text-amber-800 mb-1">老师小贴士</p>
              <div className="text-amber-900 text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}

// 代码块组件：语法高亮 + 复制 + 运行
function CodeBlock({ code, language, runnable }: { code: string; language: string; runnable?: boolean }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const highlightedRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (highlightedRef.current) {
      hljs.highlightElement(highlightedRef.current)
    }
  }, [code])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-[#282c34]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#21252b] border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-gray-400 font-mono">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '已复制' : '复制'}
          </button>
          {runnable && (
            <button
              onClick={() => navigate(`/student/problems/demo?code=${encodeURIComponent(code)}`)}
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors px-2 py-1 rounded hover:bg-white/10"
            >
              <Play className="w-3.5 h-3.5" />
              运行
            </button>
          )}
        </div>
      </div>
      <pre className="p-5 overflow-x-auto text-sm bg-[#282c34] text-gray-100">
        <code ref={highlightedRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

// 提示折叠组件
function HintBlock({ content }: { content: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100 transition-colors"
      >
        <span className="flex items-center gap-2">🤔 点我看提示</span>
        <span className="text-blue-400">{show ? '▲' : '▼'}</span>
      </button>
      {show && (
        <div className="px-5 py-4 bg-white text-gray-700 text-sm leading-relaxed lesson-content-paged">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

// 填空题组件
function FillBlankBlock({
  block,
  onCorrect,
  onWrong,
}: {
  block: any
  onCorrect?: () => void
  onWrong?: () => void
}) {
  const [answer, setAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)

  const check = () => {
    const userAnswer = answer.trim().toLowerCase()
    const rightAnswer = (block.metadata?.answer || '').trim().toLowerCase()
    setAnswered(true)
    const isCorrect = userAnswer === rightAnswer
    setCorrect(isCorrect)
    if (isCorrect) onCorrect?.()
    else onWrong?.()
  }

  return (
    <div>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap font-medium">{block.content}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value)
            setAnswered(false)
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="在这里输入答案..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <button onClick={check} className="btn-primary px-5 py-2.5 text-sm rounded-xl">
          检查答案
        </button>
      </div>
      {answered && (
        <div
          className={`mt-3 p-3 rounded-xl text-sm ${
            correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}
        >
          {correct ? '✅ 回答正确！' : `❌ 回答错误。正确答案是：${block.metadata?.answer}`}
        </div>
      )}
    </div>
  )
}

// 互动题组件
function QuizBlock({
  block,
  mode,
  onCorrect,
  onWrong,
}: {
  block: any
  mode?: 'normal' | 'checkpoint'
  onCorrect?: () => void
  onWrong?: () => void
}) {
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [selected, setSelected] = useState('')

  const checkAnswer = (answer: string) => {
    setSelected(answer)
    setAnswered(true)
    const isCorrect = answer === block.metadata?.answer
    setCorrect(isCorrect)
    if (isCorrect) onCorrect?.()
    else onWrong?.()
  }

  if (block.metadata?.type === 'choice') {
    const lines = block.content.split('\n').filter((l: string) => l.trim())
    const questionLine = lines.find((l: string) => /^\*\*.*\*\*/.test(l.trim())) || lines[0] || ''

    let options = lines.filter((l: string) => /^[A-D][.．]/.test(l.trim()))

    if (options.length < 2) {
      const allText = lines.join(' ')
      const matches = allText.match(/([A-D])[.．]\s+([^A-D]*?)(?=\s+[A-D][.．]|$)/g) || []
      options = matches.map((m: string) => m.trim()).filter(Boolean)
    }

    return (
      <div>
        <div className="text-gray-800 mb-4 font-bold text-lg">
          <InlineMarkdown>{questionLine}</InlineMarkdown>
        </div>
        <div className="space-y-3">
          {options.map((opt: string, idx: number) => {
            const letter = opt.trim()[0]
            const text = opt.replace(/^[A-D][.．]\s*/, '').trim()
            const isSelected = selected === letter
            const isCorrectAnswer = letter === block.metadata?.answer

            return (
              <button
                key={letter}
                onClick={() => !answered && checkAnswer(letter)}
                disabled={answered}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                  answered
                    ? isCorrectAnswer
                      ? 'bg-success/10 border-success text-success shadow-sm'
                      : isSelected
                      ? 'bg-danger/10 border-danger text-danger'
                      : 'bg-gray-50 border-gray-100 text-gray-500'
                    : isSelected
                    ? 'bg-primary-50 border-primary-400 text-primary-700'
                    : 'bg-white border-gray-100 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    answered
                      ? isCorrectAnswer
                        ? 'bg-success text-white'
                        : isSelected
                        ? 'bg-danger text-white'
                        : 'bg-gray-200 text-gray-500'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {answered && isCorrectAnswer ? (
                    <Check className="w-4 h-4" />
                  ) : answered && isSelected ? (
                    '✕'
                  ) : (
                    letter
                  )}
                </span>
                <span className="flex-1">
                  <InlineMarkdown>{text}</InlineMarkdown>
                </span>
              </button>
            )
          })}
        </div>
        {answered && (
          <div
            className={`mt-4 p-4 rounded-2xl font-medium ${
              correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}
          >
            {correct ? (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                答对啦！{mode === 'checkpoint' ? '解锁下一个知识点！' : '真棒！'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>❌</span>
                回答错误。正确答案是 {block.metadata?.answer}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (block.metadata?.type === 'fill') {
    return <FillBlankBlock block={block} onCorrect={onCorrect} onWrong={onWrong} />
  }

  return <div className="text-gray-500">未知题型</div>
}

// 行内 Markdown
function InlineMarkdown({ children }: { children: string }) {
  return (
    <span className="inline-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </span>
  )
}
