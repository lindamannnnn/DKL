import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, MessageCircle, BookOpen, CheckCircle2, Star, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

  useEffect(() => {
    if (id) loadLesson()
  }, [id])

  useEffect(() => {
    setCurrentPage(0)
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [currentPage])

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
  const progress = Math.round(((currentPage + 1) / totalPages) * 100)

  const currentLessonIndex = lesson?.chapter.lessons.findIndex((l) => l.id === id) ?? -1
  const nextLesson = lesson && currentLessonIndex < lesson.chapter.lessons.length - 1 ? lesson.chapter.lessons[currentLessonIndex + 1] : null

  const handleComplete = async () => {
    if (!lesson) return
    try {
      const res: any = await client.post(`/lessons/${id}/complete`)
      setCompletedReward({
        xp: res.xpGained || lesson.xpReward || 10,
        levelUp: res.levelUp || false,
        newLevel: res.newLevel,
        badges: res.newBadges || [],
      })
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
  }

  const handleQuizCorrect = () => {
    setXpGain(3)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-gray-500">加载中...</div>
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
              <h1 className="text-lg font-bold text-gray-900 truncate">{lesson.title}</h1>
              <div className="flex items-center gap-3">
                {lesson.progress?.status === 'completed' ? (
                  <span className="text-sm text-success font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    已完成
                  </span>
                ) : null}
              </div>
            </div>
            {/* 进度条 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                {currentPage + 1} / {totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* 幻灯片页面 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[calc(100vh-260px)] p-8 md:p-12">
              {/* 页面标题 */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{page.title}</h2>
              </div>

              {/* 页面内容 */}
              <div className="lesson-content lesson-content-paged space-y-6">
                {(() => {
                  const problemBlocks = page.blocks.filter((b: any) => b.type === 'problem' && b.metadata?.problemId)
                  if (problemBlocks.length > 0) {
                    return (
                      <ProblemPracticeBlock
                        problemIds={problemBlocks.map((b: any) => b.metadata.problemId)}
                        lessonId={lesson.id}
                      />
                    )
                  }
                  return page.blocks.map((block: any, idx: number) => (
                    <ContentBlock
                      key={idx}
                      block={block}
                      lessonId={lesson.id}
                      onCheckpointPass={handleCheckpointPass}
                      onQuizCorrect={handleQuizCorrect}
                    />
                  ))
                })()}
              </div>

              {/* 页面底部导航 */}
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  上一步
                </button>

                {currentPage < totalPages - 1 ? (
                  <button
                    onClick={handleNextPage}
                    className="flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors font-bold shadow-sm shadow-primary-200"
                  >
                    下一步
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={lesson.progress?.status === 'completed' ? () => nextLesson && navigate(`/student/lessons/${nextLesson.id}`) : handleComplete}
                    className="flex items-center px-6 py-3 rounded-xl bg-success text-white hover:bg-success/90 transition-colors font-bold shadow-sm"
                  >
                    {lesson.progress?.status === 'completed' ? (nextLesson ? '下一课' : '已完成') : '完成学习'}
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
      {newBadges.length > 0 && (
        <BadgeToast badges={newBadges} onClose={() => setNewBadges([])} />
      )}

      {/* 经验飘字 */}
      {xpGain !== null && <XPGain amount={xpGain} onDone={() => setXpGain(null)} />}
    </div>
  )
}

// 内容块渲染
function ContentBlock({
  block,
  lessonId,
  onCheckpointPass,
  onQuizCorrect,
}: {
  block: any
  lessonId?: string
  onCheckpointPass?: () => void
  onQuizCorrect?: () => void
}) {
  const navigate = useNavigate()

  switch (block.type) {
    case 'markdown':
      return <CollapsibleMarkdown content={block.content} />

    case 'story':
      return (
        <div className="my-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📖</span>
            <div className="text-gray-700 leading-relaxed text-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
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
        <div className={`my-6 p-6 rounded-3xl border ${bgColors[cardType] || bgColors.teacher}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">{icons[cardType] || icons.teacher}</span>
            <div className="text-gray-800 leading-relaxed text-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )
    }

    case 'demo':
      return (
        <div className="my-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">{block.language || 'cpp'}</span>
            </div>
            <button
              onClick={() => navigate(`/student/problems/demo?code=${encodeURIComponent(block.content)}`)}
              className="flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              运行代码
            </button>
          </div>
          <pre className="p-5 overflow-x-auto text-sm bg-gray-900 text-gray-100">
            <code>{block.content}</code>
          </pre>
        </div>
      )

    case 'checkpoint':
      return (
        <div className="my-6 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl border-2 border-primary-200">
          <h4 className="font-bold text-primary-800 mb-2 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm">?</span>
            小挑战
            <span className="ml-auto text-xs font-normal text-primary-600 bg-white px-2 py-1 rounded-full border border-primary-100">
              可选
            </span>
          </h4>
          <p className="text-sm text-primary-700/70 mb-4">答对可获得额外经验奖励，不答也能继续学习哦～</p>
          {block.metadata?.quiz && (
            <QuizBlock
              block={block.metadata.quiz}
              mode="checkpoint"
              onCorrect={onCheckpointPass}
            />
          )}
        </div>
      )

    case 'code':
      return (
        <div className="my-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">{block.language || 'cpp'}</span>
            </div>
            {block.metadata?.runnable && (
              <button
                onClick={() => navigate(`/student/problems/demo?code=${encodeURIComponent(block.content)}`)}
                className="flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                运行代码
              </button>
            )}
          </div>
          <pre className="p-5 overflow-x-auto text-sm bg-gray-900 text-gray-100">
            <code>{block.content}</code>
          </pre>
        </div>
      )

    case 'quiz':
      return (
        <div className="my-6 p-6 bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl border border-primary-100">
          <h4 className="font-bold text-primary-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm">?</span>
            练一练
          </h4>
          <QuizBlock block={block} onCorrect={onQuizCorrect} />
        </div>
      )

    case 'problem':
      return (
        <div className="my-6">
          <button
            onClick={() => navigate(`/student/problems/${block.metadata?.problemId}?lessonId=${lessonId}`)}
            className="w-full p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-amber-800 font-medium hover:from-amber-100 hover:to-orange-100 transition-colors flex items-center justify-center gap-2"
          >
            📝 去做课后编程题
          </button>
        </div>
      )

    case 'hint':
      return <HintBlock content={block.content} />

    case 'coach-tip':
      return (
        <div className="my-6 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">老师小贴士</p>
              <div className="text-amber-900 text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}

// 提示折叠组件
function HintBlock({ content }: { content: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="my-6 border border-blue-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setShow(!show)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100 transition-colors"
      >
        <span className="flex items-center gap-2">🤔 点我看提示</span>
        <span className="text-blue-400">{show ? '▲' : '▼'}</span>
      </button>
      {show && (
        <div className="px-5 py-4 bg-white text-gray-700 text-sm leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

// 填空题组件
function FillBlankBlock({ block, onCorrect }: { block: any; onCorrect?: () => void }) {
  const [answer, setAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)

  const check = () => {
    const userAnswer = answer.trim().toLowerCase()
    const rightAnswer = (block.metadata?.answer || '').trim().toLowerCase()
    setAnswered(true)
    setCorrect(userAnswer === rightAnswer)
    if (userAnswer === rightAnswer) onCorrect?.()
  }

  return (
    <div>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{block.content}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => { setAnswer(e.target.value); setAnswered(false) }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="在这里输入答案..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <button
          onClick={check}
          className="btn-primary px-5 py-2.5 text-sm rounded-xl"
        >
          检查答案
        </button>
      </div>
      {answered && (
        <div className={`mt-3 p-3 rounded-xl text-sm ${correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {correct ? '✅ 回答正确！' : `❌ 回答错误。正确答案是：${block.metadata?.answer}`}
        </div>
      )}
    </div>
  )
}

// 互动题组件
function QuizBlock({ block, mode, onCorrect }: { block: any; mode?: 'normal' | 'checkpoint'; onCorrect?: () => void }) {
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [selected, setSelected] = useState('')

  const checkAnswer = (answer: string) => {
    setSelected(answer)
    setAnswered(true)
    const isCorrect = answer === block.metadata?.answer
    setCorrect(isCorrect)
    if (isCorrect) onCorrect?.()
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
        <div className="text-gray-700 mb-4 font-medium">
          <InlineMarkdown>{questionLine}</InlineMarkdown>
        </div>
        <div className="space-y-2.5">
          {options.map((opt: string) => {
            const letter = opt.trim()[0]
            const text = opt.replace(/^[A-D][.．]\s*/, '').trim()
            const isSelected = selected === letter
            const isCorrect = letter === block.metadata?.answer

            return (
              <button
                key={letter}
                onClick={() => !answered && checkAnswer(letter)}
                disabled={answered}
                className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${
                  answered
                    ? isCorrect
                      ? 'bg-success/10 border-success text-success'
                      : isSelected
                      ? 'bg-danger/10 border-danger text-danger'
                      : 'bg-gray-50 border-gray-100 text-gray-500'
                    : 'bg-white border-gray-100 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <span className="font-bold mr-2">{letter}.</span>
                <InlineMarkdown>{text}</InlineMarkdown>
              </button>
            )
          })}
        </div>
        {answered && (
          <div className={`mt-4 p-4 rounded-xl ${correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            {correct ? (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                答对啦！{mode === 'checkpoint' ? '获得额外经验奖励！' : '真棒！'}
              </div>
            ) : (
              `❌ 回答错误。正确答案是 ${block.metadata?.answer}`
            )}
          </div>
        )}
      </div>
    )
  }

  if (block.metadata?.type === 'fill') {
    return <FillBlankBlock block={block} onCorrect={onCorrect} />
  }

  return <div className="text-gray-500">未知题型</div>
}

// 可折叠 Markdown：长文字默认分段揭示，避免一页内容过多
function CollapsibleMarkdown({ content, initialParagraphs = 2 }: { content: string; initialParagraphs?: number }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean)
  const hasMore = paragraphs.length > initialParagraphs
  const [expanded, setExpanded] = useState(false)

  const displayContent = expanded ? content : paragraphs.slice(0, initialParagraphs).join('\n\n')

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              收起内容
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              展开更多 ({paragraphs.length - initialParagraphs} 段)
            </>
          )}
        </button>
      )}
    </div>
  )
}

// 行内 Markdown（用于按钮等不能放块级元素的地方）
function InlineMarkdown({ children }: { children: string }) {
  return (
    <span className="inline-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </span>
  )
}
