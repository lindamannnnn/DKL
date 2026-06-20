import { useEffect, useRef } from 'react'
import { X, Trophy, Star, Flame } from 'lucide-react'

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
  nextText?: string
  onNext: () => void
  onClose?: () => void
}

export default function CelebrationModal({
  title,
  subtitle,
  reward,
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

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }[] = []
    const colors = ['#FCD34D', '#F87171', '#60A5FA', '#34D399', '#A78BFA', '#F472B6']

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        life: 1,
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
        p.vy += 0.25
        p.life -= 0.015
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-scale-in">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-yellow-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-6">{subtitle}</p>}

        {reward && (
          <div className="space-y-3 mb-6">
            {reward.xp ? (
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-primary-600">
                <Star className="w-6 h-6 fill-current" />
                +{reward.xp} 经验值
              </div>
            ) : null}

            {reward.levelUp ? (
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-orange-600">
                <Flame className="w-6 h-6 fill-current" />
                升级到等级 {reward.newLevel}！
              </div>
            ) : null}

            {reward.badges && reward.badges.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500 mb-2">获得徽章</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {reward.badges.map((badge) => (
                    <span
                      key={badge.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
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

        <button
          onClick={onNext}
          className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
        >
          {nextText}
        </button>
      </div>
    </div>
  )
}
