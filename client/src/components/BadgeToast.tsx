import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

interface BadgeToastProps {
  badges: Badge[]
  onClose: () => void
}

export default function BadgeToast({ badges, onClose }: BadgeToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4 min-w-[280px] animate-fade-in-up"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              {badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-600 font-semibold">获得新徽章</p>
              <h4 className="font-bold text-gray-900 truncate">{badge.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
