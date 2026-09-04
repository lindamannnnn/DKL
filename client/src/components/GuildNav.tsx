import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Map, Sword, Trophy, Library, Shield, LogOut } from 'lucide-react'

// 冒险公会全局顶部导航：冒险大厅 / 知识页共用
const NAV_ITEMS = [
  { to: '/student/courses', icon: Map, label: '冒险地图' },
  { to: '/student/problems', icon: Sword, label: '试炼场' },
  { to: '/student/exams', icon: Trophy, label: '竞技场' },
  { to: '/student/knowledge', icon: Library, label: '智慧书库' },
  { to: '/student/dashboard', icon: Shield, label: '我的徽章' },
]

export default function GuildNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('dkl_token')
    localStorage.removeItem('user')
    localStorage.removeItem('dkl_user')
    localStorage.removeItem('tenantId')
    localStorage.removeItem('dkl_tenantId')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b-4 border-amber-900/50 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="text-xl font-black text-amber-400 cursor-pointer flex items-center gap-2 tracking-wide"
          onClick={() => navigate('/student/courses')}
        >
          <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">🗺️</span>
          <span className="drop-shadow-md">DKL 冒险公会</span>
        </div>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavButton
              key={to}
              icon={<Icon className="w-4 h-4" />}
              label={label}
              active={isActive(to)}
              onClick={() => navigate(to)}
            />
          ))}
          <button
            onClick={handleLogout}
            className="ml-2 p-2 text-amber-100/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        active
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
          : 'text-amber-100/70 hover:text-amber-100 hover:bg-white/5 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
