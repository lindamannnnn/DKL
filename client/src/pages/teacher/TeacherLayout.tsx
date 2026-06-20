import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, FileQuestion, Users, BarChart3, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const navItems = [
  { path: '/teacher/courses', label: '课程管理', icon: BookOpen },
  { path: '/teacher/problems', label: '题库管理', icon: FileQuestion },
  { path: '/teacher/classes', label: '班级管理', icon: Users },
  { path: '/teacher/reports', label: '学情报告', icon: BarChart3 },
]

export default function TeacherLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">教师后台</h1>
          <p className="text-sm text-gray-500 mt-1">DKL 学习平台</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-3 border-t border-gray-200 bg-white">
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto"><Outlet /></main>
    </div>
  )
}
