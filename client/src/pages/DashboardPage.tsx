import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Code, Trophy, Flame, Star, ChevronRight } from 'lucide-react'
import Layout from '../components/Layout'
import client from '../api/client'

interface UserStats {
  level: number
  experience: number
  streak: number
  completedLessons: number
  acceptedSubmissions: number
  totalSubmissions: number
}

interface Badge {
  id: string
  name: string
  icon: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, badgesRes]: any = await Promise.all([
        client.get('/progress/stats'),
        client.get('/achievements/my'),
      ])

      setStats({
        level: statsRes.level || 1,
        experience: statsRes.experience || 0,
        streak: statsRes.streak || 0,
        completedLessons: statsRes.completedLessons || 0,
        acceptedSubmissions: statsRes.acceptedSubmissions || 0,
        totalSubmissions: statsRes.totalSubmissions || 0,
      })

      setBadges(badgesRes.slice(0, 4).map((b: any) => b.achievement))
    } catch (err) {
      console.error('加载个人中心失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const xpForCurrentLevel = stats ? (stats.level - 1) * 100 : 0
  const xpProgress = stats ? Math.min(100, Math.round(((stats.experience - xpForCurrentLevel) / 100) * 100)) : 0

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">个人中心</h1>

          {loading || !stats ? (
            <div className="text-center py-20 text-gray-500">加载中...</div>
          ) : (
            <>
              {/* 等级与经验 */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-6 text-white mb-6 shadow-lg shadow-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black">
                      Lv.{stats.level}
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">当前等级</p>
                      <p className="text-2xl font-bold">编程小学徒</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">总经验</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <Star className="w-5 h-5 fill-current" />
                      {stats.experience}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>升级进度</span>
                    <span>{stats.experience - xpForCurrentLevel} / 100 XP</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<BookOpen className="w-6 h-6" />} label="完成课时" value={stats.completedLessons} color="primary" />
                <StatCard icon={<Code className="w-6 h-6" />} label="通过题目" value={stats.acceptedSubmissions} color="success" />
                <StatCard icon={<Trophy className="w-6 h-6" />} label="提交次数" value={stats.totalSubmissions} color="warning" />
                <StatCard icon={<Flame className="w-6 h-6" />} label="连续打卡" value={stats.streak} color="danger" />
              </div>

              {/* 最近徽章 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">我的徽章</h2>
                  <Link
                    to="/student/achievements"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    查看全部
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                {badges.length === 0 ? (
                  <p className="text-gray-500 text-sm">还没有获得徽章，去完成学习和编程挑战吧！</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 text-center"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="font-bold text-gray-900 text-sm">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}
