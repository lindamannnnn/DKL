import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, Lock, Play, Crown, MapPin, Flag } from 'lucide-react'
import client from '../api/client'

interface LessonData {
  id: string
  title: string
  sortOrder: number
  status: 'not_started' | 'in_progress' | 'completed'
  chapterId: string
}

interface ChapterData {
  id: string
  title: string
  lessons: LessonData[]
}

interface CourseData {
  id: string
  title: string
  description: string | null
  levelMin: number
  levelMax: number
  chapters: ChapterData[]
}

// ===== 像素风地形主题：1-8 级对应越来越难的环境 =====
interface Terrain {
  name: string
  emoji: string
  sky: string
  skyObjects: { type: 'sun' | 'moon' | 'planet'; color: string; position: string }[]
  ground: string
  groundTop: string
  groundPattern: string
  pathColor: string
  pathBorder: string
  nodeCompleted: { bg: string; border: string }
  nodeCurrent: { bg: string; border: string }
  nodeLocked: { bg: string; border: string }
  scenery: {
    far: string[] // 远景 emoji/装饰
    mid: string[] // 中景 emoji
    near: string[] // 近景 emoji
    particle: string // 漂浮粒子 emoji
  }
  tagline: string
  vibe: 'bright' | 'dark' | 'cold' | 'hot'
}

const TERRAINS: Terrain[] = [
  {
    name: '青青草原',
    emoji: '🌱',
    sky: 'from-sky-300 via-sky-200 to-green-200',
    skyObjects: [{ type: 'sun', color: '#FCD34D', position: '85% 8%' }],
    ground: 'bg-green-400',
    groundTop: 'bg-green-500',
    groundPattern: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(0,0,0,0.04) 18px, rgba(0,0,0,0.04) 20px)',
    pathColor: '#D2691E',
    pathBorder: '#8B4513',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-green-300', border: 'border-green-700' },
    nodeLocked: { bg: 'bg-stone-400', border: 'border-stone-700' },
    scenery: {
      far: ['⛰️', '🏔️', '🌲'],
      mid: ['🌳', '🌻', '🦋', '🐰'],
      near: ['🌿', '🌾', '🍀'],
      particle: '✨',
    },
    tagline: '从这里出发，学习最简单的 C++ 魔法',
    vibe: 'bright',
  },
  {
    name: '炽热沙漠',
    emoji: '🌵',
    sky: 'from-yellow-200 via-orange-100 to-amber-200',
    skyObjects: [{ type: 'sun', color: '#FF6B35', position: '80% 5%' }],
    ground: 'bg-amber-300',
    groundTop: 'bg-amber-400',
    groundPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 12px)',
    pathColor: '#DEB887',
    pathBorder: '#CD853F',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-orange-300', border: 'border-orange-700' },
    nodeLocked: { bg: 'bg-stone-400', border: 'border-stone-700' },
    scenery: {
      far: ['🏜️', '🏜️', '⛰️'],
      mid: ['🌵', '🌵', '🐪', '🦂'],
      near: ['🪨', '🦴', '🏺'],
      particle: '☀️',
    },
    tagline: '沙漠里没有捷径，每一步都要踏实',
    vibe: 'hot',
  },
  {
    name: '迷雾森林',
    emoji: '🌲',
    sky: 'from-emerald-300 via-teal-200 to-green-300',
    skyObjects: [{ type: 'sun', color: '#86EFAC', position: '75% 10%' }],
    ground: 'bg-emerald-600',
    groundTop: 'bg-emerald-700',
    groundPattern: 'repeating-linear-gradient(90deg, transparent, transparent 22px, rgba(0,0,0,0.06) 22px, rgba(0,0,0,0.06) 24px)',
    pathColor: '#8B4513',
    pathBorder: '#5D4037',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-teal-300', border: 'border-teal-700' },
    nodeLocked: { bg: 'bg-stone-500', border: 'border-stone-800' },
    scenery: {
      far: ['🌲', '🌲', '🌲', '🏔️'],
      mid: ['🌳', '🍄', '🦉', '🦌'],
      near: ['🌿', '🌱', '🪵'],
      particle: '🌫️',
    },
    tagline: '森林里藏着更多语法陷阱，小心前进',
    vibe: 'bright',
  },
  {
    name: '冰封雪山',
    emoji: '⛄',
    sky: 'from-slate-300 via-blue-100 to-white',
    skyObjects: [{ type: 'sun', color: '#E2E8F0', position: '70% 12%' }],
    ground: 'bg-slate-200',
    groundTop: 'bg-slate-300',
    groundPattern: 'repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(100,116,139,0.08) 14px, rgba(100,116,139,0.08) 16px)',
    pathColor: '#94A3B8',
    pathBorder: '#64748B',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-sky-300', border: 'border-sky-700' },
    nodeLocked: { bg: 'bg-slate-400', border: 'border-slate-700' },
    scenery: {
      far: ['🏔️', '🏔️', '🏔️'],
      mid: ['🌲', '🦌', '🛷', '❄️'],
      near: ['🧊', '⛄', '🎿'],
      particle: '❄️',
    },
    tagline: '越往上越冷，但风景也越壮观',
    vibe: 'cold',
  },
  {
    name: '熔岩火山',
    emoji: '🌋',
    sky: 'from-orange-400 via-red-300 to-rose-400',
    skyObjects: [{ type: 'sun', color: '#EF4444', position: '80% 8%' }],
    ground: 'bg-red-900',
    groundTop: 'bg-red-950',
    groundPattern: 'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.15) 16px, rgba(0,0,0,0.15) 18px)',
    pathColor: '#374151',
    pathBorder: '#111827',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-red-400', border: 'border-red-900' },
    nodeLocked: { bg: 'bg-stone-600', border: 'border-stone-900' },
    scenery: {
      far: ['🌋', '🌋', '⛰️'],
      mid: ['🔥', '🌋', '🦇', '☄️'],
      near: ['🪨', '💀', '⚔️'],
      particle: '🔥',
    },
    tagline: '难度开始燃烧，准备好接受挑战了吗？',
    vibe: 'hot',
  },
  {
    name: '剧毒沼泽',
    emoji: '🐊',
    sky: 'from-lime-900 via-emerald-900 to-teal-900',
    skyObjects: [{ type: 'moon', color: '#A3E635', position: '75% 10%' }],
    ground: 'bg-emerald-800',
    groundTop: 'bg-emerald-900',
    groundPattern: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.12) 12px, rgba(0,0,0,0.12) 14px)',
    pathColor: '#556B2F',
    pathBorder: '#2F4F4F',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-lime-400', border: 'border-lime-900' },
    nodeLocked: { bg: 'bg-stone-600', border: 'border-stone-900' },
    scenery: {
      far: ['🌲', '🌲', '⛰️'],
      mid: ['👻', '🍄', '🕸️', '🦎'],
      near: ['🪵', '🍃', '🐸'],
      particle: '👻',
    },
    tagline: '沼泽里的 bug 会缠住你，调试能力要够强',
    vibe: 'dark',
  },
  {
    name: '幽暗深渊',
    emoji: '💎',
    sky: 'from-indigo-950 via-purple-950 to-slate-950',
    skyObjects: [{ type: 'planet', color: '#A855F7', position: '70% 15%' }],
    ground: 'bg-slate-900',
    groundTop: 'bg-slate-950',
    groundPattern: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 22px)',
    pathColor: '#4C1D95',
    pathBorder: '#1E1B4B',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-violet-400', border: 'border-violet-900' },
    nodeLocked: { bg: 'bg-slate-700', border: 'border-slate-950' },
    scenery: {
      far: ['⛰️', '🗻', '🌑'],
      mid: ['💎', '🦇', '⚡', '🕸️'],
      near: ['🪨', '💀', '🕯️'],
      particle: '✨',
    },
    tagline: '这里接近算法的黑暗森林，只有少数人能到达',
    vibe: 'dark',
  },
  {
    name: '星河城堡',
    emoji: '🏰',
    sky: 'from-blue-950 via-indigo-900 to-purple-900',
    skyObjects: [
      { type: 'planet', color: '#FBBF24', position: '75% 8%' },
      { type: 'moon', color: '#E2E8F0', position: '15% 12%' },
    ],
    ground: 'bg-indigo-950',
    groundTop: 'bg-indigo-900',
    groundPattern: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 2px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.06) 1px, transparent 1px)',
    pathColor: '#FBBF24',
    pathBorder: '#B45309',
    nodeCompleted: { bg: 'bg-yellow-300', border: 'border-yellow-700' },
    nodeCurrent: { bg: 'bg-amber-300', border: 'border-amber-700' },
    nodeLocked: { bg: 'bg-slate-700', border: 'border-slate-950' },
    scenery: {
      far: ['🏰', '🏰', '🌟'],
      mid: ['🚀', '🛸', '🌙', '⭐'],
      near: ['💎', '🔮', '⚔️'],
      particle: '🌟',
    },
    tagline: '编程大师的最终试炼场',
    vibe: 'dark',
  },
]

function getTerrain(level: number): Terrain {
  return TERRAINS[Math.max(0, Math.min(7, level - 1))] || TERRAINS[0]
}

// 计算每个关卡在地图上的坐标（S 形蜿蜒路径），使用实际像素坐标
function computePathPositions(count: number, width: number) {
  const positions: { x: number; y: number; side: 'left' | 'right' }[] = []
  const cols = 4
  const nodeSize = 88
  const rowHeight = 230
  const startY = 130
  const paddingX = Math.max(70, width * 0.08)
  const usableWidth = Math.max(width - paddingX * 2, nodeSize * cols)
  const gapX = (usableWidth - nodeSize) / (cols - 1)

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const direction = row % 2 === 0 ? 1 : -1
    const baseX = paddingX + col * gapX + nodeSize / 2
    const x = direction === 1 ? baseX : width - baseX
    const y = startY + row * rowHeight
    positions.push({ x, y, side: x < width / 2 ? 'left' : 'right' })
  }
  return positions
}

// 生成连接节点的 SVG 路径
function buildSvgPath(positions: { x: number; y: number }[]) {
  if (positions.length === 0) return ''
  const first = positions[0]
  let d = `M ${first.x} ${first.y}`
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    const midY = (prev.y + curr.y) / 2
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
  }
  return d
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (id) loadCourse()
  }, [id])

  useEffect(() => {
    const updateSize = () => {
      if (mapRef.current) {
        setMapSize({ width: mapRef.current.clientWidth, height: mapRef.current.clientHeight })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [course])

  const loadCourse = async () => {
    try {
      const res: any = await client.get(`/courses/${id}`)
      setCourse(res)
    } catch (err) {
      console.error('加载课程失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const { allLessons, completedCount, totalCount, progressRate, positions, pathD, terrain, mapHeight } = useMemo(() => {
    if (!course) {
      return { allLessons: [], completedCount: 0, totalCount: 0, progressRate: 0, positions: [], pathD: '', terrain: TERRAINS[0], mapHeight: 400 }
    }
    const lessons = course.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapterId: ch.id })))
    const completed = lessons.filter((l) => l.status === 'completed').length
    const total = lessons.length
    const width = mapSize.width || 800
    const pos = computePathPositions(total, width)
    const height = pos.length > 0 ? pos[pos.length - 1].y + 190 : 400
    return {
      allLessons: lessons,
      completedCount: completed,
      totalCount: total,
      progressRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      positions: pos,
      pathD: buildSvgPath(pos),
      terrain: getTerrain(course.levelMin || 1),
      mapHeight: height,
    }
  }, [course, mapSize])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-mono">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded animate-spin" />
          <div className="font-bold">加载地图中...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-mono text-white">
        <div>课程不存在</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${terrain.sky} font-mono relative overflow-hidden`}>
      {/* ===== 艺术感背景层 ===== */}
      <PixelBackground terrain={terrain} />

      {/* 顶部 HUD */}
      <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b-4 border-black/20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/student/courses')}
            className="flex items-center text-sm text-white/90 hover:text-white mb-3 font-bold transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回冒险大厅
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="text-5xl filter drop-shadow-lg animate-bounce-soft">{terrain.emoji}</div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/30 text-white text-xs font-bold mb-1 border-2 border-white/30">
                  <MapPin className="w-3 h-3" />
                  GESP {course.levelMin}-{course.levelMax} · {terrain.name}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md flex items-center gap-2">
                  <Crown className="w-7 h-7 text-yellow-300" />
                  {course.title}
                </h1>
                {course.description && <p className="text-white/80 text-sm mt-1 max-w-lg">{course.description}</p>}
                <p className="text-white/90 text-xs mt-1 font-bold drop-shadow">{terrain.tagline}</p>
              </div>
            </div>

            <div className="bg-black/30 p-3 border-4 border-white/30 min-w-[260px]">
              <div className="flex items-center justify-between text-white text-xs font-bold mb-2">
                <span>总进度</span>
                <span>{completedCount}/{totalCount}</span>
              </div>
              <div className="h-5 bg-black/40 border-2 border-white/20 relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-700" style={{ width: `${progressRate}%` }} />
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(0,0,0,0.2) 14px, rgba(0,0,0,0.2) 16px)' }}
                />
              </div>
              <div className="text-white/90 text-[10px] mt-1 text-right font-bold">{progressRate}% 已征服</div>
            </div>
          </div>
        </div>
      </div>

      {/* 地图主体 */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-40 relative">
        <div ref={mapRef} className="relative" style={{ height: mapHeight }}>
          {/* 章节标题浮标 */}
          {course.chapters.map((chapter) => {
            const firstLessonIdx = allLessons.findIndex((l) => l.chapterId === chapter.id)
            const pos = positions[firstLessonIdx]
            if (!pos) return null
            return (
              <div
                key={chapter.id}
                className="absolute hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur text-white text-xs font-bold border-2 border-white/40 z-10 shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
                style={{ left: pos.x, top: pos.y - 75, transform: 'translateX(-50%)' }}
              >
                <Flag className="w-3 h-3 text-yellow-300" />
                {chapter.title}
              </div>
            )
          })}

          {/* 路径 SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapSize.width || 800} ${mapHeight}`} style={{ overflow: 'visible' }}>
            <defs>
              <pattern id={`pathBricks-${terrain.name}`} patternUnits="userSpaceOnUse" width="6" height="6">
                <rect width="6" height="6" fill={terrain.pathColor} />
                <rect x="0" y="0" width="3" height="3" fill={terrain.pathBorder} opacity="0.3" />
                <rect x="3" y="3" width="3" height="3" fill={terrain.pathBorder} opacity="0.3" />
              </pattern>
            </defs>
            {pathD && (
              <>
                <path d={pathD} fill="none" stroke={terrain.pathBorder} strokeWidth="10" strokeLinecap="round" />
                <path d={pathD} fill="none" stroke={`url(#pathBricks-${terrain.name})`} strokeWidth="6" strokeLinecap="round" />
              </>
            )}
          </svg>

          {/* 关卡节点 */}
          {allLessons.map((lesson, idx) => {
            const pos = positions[idx]
            const isCompleted = lesson.status === 'completed'
            const prevCompleted = idx === 0 || allLessons[idx - 1]?.status === 'completed'
            const isCurrent = !isCompleted && prevCompleted
            const isLocked = !isCompleted && !isCurrent
            const style = isCompleted ? terrain.nodeCompleted : isCurrent ? terrain.nodeCurrent : terrain.nodeLocked

            return (
              <button
                key={lesson.id}
                onClick={() => !isLocked && navigate(`/student/lessons/${lesson.id}`)}
                disabled={isLocked}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                style={{ left: pos.x, top: pos.y }}
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-black/30 rounded-full blur-sm" />
                <div
                  className={`relative w-16 h-16 md:w-20 md:h-20 ${style.bg} border-4 ${style.border} shadow-[4px_4px_0_rgba(0,0,0,0.3)] flex items-center justify-center text-2xl md:text-3xl transition-all duration-200 ${
                    isLocked ? 'opacity-70' : 'hover:scale-110 hover:-translate-y-1 active:translate-y-0 active:shadow-none'
                  } ${isCurrent ? 'animate-bounce-soft ring-4 ring-white/60' : ''}`}
                >
                  {isCompleted ? (
                    <Star className="w-8 h-8 md:w-10 md:h-10 text-yellow-800 fill-current" />
                  ) : isCurrent ? (
                    <Play className="w-7 h-7 md:w-9 md:h-9 text-green-900 fill-current" />
                  ) : (
                    <Lock className="w-7 h-7 md:w-9 md:h-9 text-stone-700" />
                  )}
                  {isCurrent && <div className="absolute -top-3 -right-3 text-lg animate-bounce-soft">{terrain.emoji}</div>}
                </div>

                <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-28 md:w-36 text-center">
                  <div
                    className={`inline-block px-2 py-1 text-[10px] md:text-xs font-bold border-2 mb-1 ${
                      isLocked ? 'bg-stone-200 border-stone-500 text-stone-600' : 'bg-white border-black/30 text-gray-800'
                    }`}
                  >
                    关卡 {idx + 1}
                  </div>
                  <div className={`text-[10px] md:text-xs font-bold leading-tight ${isLocked ? 'text-stone-500/80' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]'}`}>
                    {lesson.title.replace(/^课程\d+：/, '')}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}

// ===== 像素艺术背景 =====
function PixelBackground({ terrain }: { terrain: Terrain }) {
  const decor = useMemo(() => {
    const items: { emoji: string; left: string; bottom: string; size: number; delay: number; layer: 'far' | 'mid' | 'near' }[] = []
    const seed = (s: string) => {
      let h = 0
      for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
      return Math.abs(h) / 2147483647
    }

    terrain.scenery.far.forEach((emoji, i) => {
      const hash = seed(`far-${i}-${terrain.name}`)
      items.push({ emoji, left: `${10 + hash * 80}%`, bottom: `${35 + (hash % 0.15)}%`, size: 28 + Math.floor(hash * 20), delay: hash * 4, layer: 'far' })
    })
    terrain.scenery.mid.forEach((emoji, i) => {
      const hash = seed(`mid-${i}-${terrain.name}`)
      items.push({ emoji, left: `${5 + hash * 90}%`, bottom: `${18 + (hash % 0.12)}%`, size: 22 + Math.floor(hash * 16), delay: hash * 5, layer: 'mid' })
    })
    terrain.scenery.near.forEach((emoji, i) => {
      const hash = seed(`near-${i}-${terrain.name}`)
      items.push({ emoji, left: `${3 + hash * 94}%`, bottom: `${6 + (hash % 0.08)}%`, size: 18 + Math.floor(hash * 12), delay: hash * 3, layer: 'near' })
    })
    return items
  }, [terrain])

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 37) % 100}%`,
      top: `${20 + (i * 13) % 60}%`,
      size: 8 + (i % 6),
      delay: i * 0.4,
      duration: 4 + (i % 4),
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* 天空天体 */}
      {terrain.skyObjects.map((obj, i) => (
        <SkyObject key={i} type={obj.type} color={obj.color} position={obj.position} />
      ))}

      {/* 远景山峦剪影 */}
      <PixelMountains terrain={terrain} />

      {/* 装饰物层 */}
      {decor.map((item, i) => (
        <div
          key={i}
          className={`absolute select-none ${item.layer === 'far' ? 'opacity-40 blur-[1px]' : item.layer === 'mid' ? 'opacity-70' : 'opacity-90'}`}
          style={{
            left: item.left,
            bottom: item.bottom,
            fontSize: item.size,
            animation: `float ${5 + item.delay}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
            filter: item.layer === 'near' ? 'drop-shadow(2px 2px 0 rgba(0,0,0,0.2))' : 'none',
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* 地面像素层 */}
      <div className={`absolute bottom-0 left-0 right-0 h-36 ${terrain.ground}`} style={{ backgroundImage: terrain.groundPattern }}>
        <div className={`absolute -top-3 left-0 right-0 h-4 ${terrain.groundTop}`} style={{ clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 40%, 20% 100%, 25% 20%, 30% 100%, 35% 50%, 40% 100%, 45% 10%, 50% 100%, 55% 60%, 60% 100%, 65% 30%, 70% 100%, 75% 70%, 80% 100%, 85% 40%, 90% 100%, 95% 20%, 100% 100%)' }} />
      </div>

      {/* 漂浮粒子 */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-60"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.size,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {terrain.scenery.particle}
        </div>
      ))}
    </div>
  )
}

function SkyObject({ type, color, position }: { type: 'sun' | 'moon' | 'planet'; color: string; position: string }) {
  const [posX, posY] = position.split(' ')
  if (type === 'sun') {
    return (
      <div
        className="absolute rounded-sm animate-pulse-soft"
        style={{
          left: posX,
          top: posY,
          width: 64,
          height: 64,
          backgroundColor: color,
          boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
        }}
      />
    )
  }
  if (type === 'moon') {
    return (
      <div
        className="absolute rounded-full"
        style={{
          left: posX,
          top: posY,
          width: 48,
          height: 48,
          backgroundColor: color,
          boxShadow: `0 0 30px ${color}`,
          clipPath: 'circle(50% at 50% 50%)',
        }}
      />
    )
  }
  return (
    <div
      className="absolute"
      style={{
        left: posX,
        top: posY,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
        boxShadow: `0 0 30px ${color}`,
      }}
    />
  )
}

function PixelMountains({ terrain }: { terrain: Terrain }) {
  const isDark = terrain.vibe === 'dark'
  return (
    <svg className="absolute bottom-28 left-0 w-full h-64 opacity-30" preserveAspectRatio="none" viewBox="0 0 1200 256">
      <defs>
        <linearGradient id={`mountainGrad-${terrain.name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isDark ? '#1e1b4b' : '#14532d'} />
          <stop offset="100%" stopColor={isDark ? '#0f172a' : '#166534'} />
        </linearGradient>
      </defs>
      <polygon
        points="0,256 150,80 300,180 450,60 600,200 750,100 900,220 1050,70 1200,256"
        fill={`url(#mountainGrad-${terrain.name})`}
      />
      {terrain.vibe === 'cold' && (
        <polygon points="420,60 450,60 440,90" fill="white" opacity="0.6" />
      )}
      {terrain.vibe === 'hot' && (
        <circle cx="1050" cy="70" r="8" fill="#ef4444" opacity="0.8" />
      )}
    </svg>
  )
}
