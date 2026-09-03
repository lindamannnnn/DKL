import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, Code, Trophy, User, LogOut, Search } from 'lucide-react'

export default function Layout({ children }: { children: ReactNode }) {
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
            <NavButton icon={<Search className="w-4 h-4" />} label="知识快查" active={isActive('/student/knowledge')} onClick={() => navigate('/student/knowledge')} />
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
      <main>{children}</main>
    </div>
  )
}

function NavButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
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
