import { useEffect, useState } from 'react'

interface XPGainProps {
  amount: number
  onDone?: () => void
}

export default function XPGain({ amount, onDone }: XPGainProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="text-4xl font-black text-yellow-500 drop-shadow-lg animate-float">
        +{amount} XP
      </div>
    </div>
  )
}
