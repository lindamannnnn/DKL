import { useEffect, useRef } from 'react'
import { X, Trophy, Star, Flame, ArrowRight, Crown, Sparkles } from 'lucide-react'

interface Reward {
  xp?: number
  levelUp?: boolean
  newLevel?: number
  badges?: { id: string; name: string; icon: string }[]
}

interface CelebrationModalProps {
  title: string
  subtitle?: string
  reward?: Reward
  streak?: number
  weeklyCompleted?: boolean
  nextLessonTitle?: string | null
  nextText?: string
  onNext: () => void
  onClose?: () => void
}

export default function CelebrationModal({
  title,
  subtitle,
  reward,
  streak = 0,
  weeklyCompleted = false,
  nextLessonTitle,
  nextText = '继续',
  onNext,
  onClose,
}: CelebrationModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number; rotation: number; rotationSpeed: number }[] = []
    const colors = ['#FCD34D', '#F87171', '#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FB923C', '#22D3EE']

    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 50,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particles) {
        if (p.life <= 0) continue
        alive = true
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.rotation += p.rotationSpeed
        p.life -= 0.008
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        // 画小星星
        ctx.beginPath()
        for (let s = 0; s < 5; s++) {
          const angle = (s * 4 * Math.PI) / 5 - Math.PI / 2
          const r = s % 2 === 0 ? p.size : p.size / 2
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      if (alive) {
        animationId = requestAnimationFrame(animate)
      }
    }
    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4 text-center animate-scale-in overflow-hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500" />

        <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200 animate-bounce-soft">
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-5">{subtitle}</p>}

        {reward && (
          <div className="space-y-3 mb-5">
            {reward.xp ? (
              <div className="flex items-center justify-center gap-2 text-xl font-black text-primary-600 bg-primary-50 py-2 rounded-xl">
                <Star className="w-6 h-6 fill-current" />
                +{reward.xp} 经验值
              </div>
            ) : null}

            {reward.levelUp ? (
              <div className="flex items-center justify-center gap-2 text-xl font-black text-orange-600 bg-orange-50 py-2 rounded-xl">
                <Crown className="w-6 h-6" />
                升级到等级 {reward.newLevel}！
              </div>
            ) : null}

            {weeklyCompleted && (
              <div className="flex items-center justify-center gap-2 text-lg font-black text-orange-600 bg-gradient-to-r from-orange-50 to-yellow-50 py-2 rounded-xl border border-orange-100">
                <Flame className="w-5 h-5 fill-current" />
                本周任务完成！连胜 {streak} 周 🔥
              </div>
            )}

            {reward.badges && reward.badges.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-sm text-amber-700 font-bold mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  获得新徽章
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {reward.badges.map((badge) => (
                    <span
                      key={badge.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-bold"
                    >
                      <span>{badge.icon}</span>
                      {badge.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {nextLessonTitle && (
          <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm text-gray-600">
            <span className="text-gray-400">下一关：</span>
            <span className="font-bold text-gray-800">{nextLessonTitle}</span>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-2xl font-black text-lg hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          {nextText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
