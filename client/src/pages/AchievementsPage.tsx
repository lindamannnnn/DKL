import { useEffect, useState } from 'react'
import { Trophy, Lock, Flame, Star } from 'lucide-react'
import Layout from '../components/Layout'
import client from '../api/client'

interface Achievement {
  id: string
  code: string
  name: string
  description: string
  icon: string
}

interface MyAchievement {
  id: string
  achievementId: string
  earnedAt: string
  achievement: Achievement
}

export default function AchievementsPage() {
  const [all, setAll] = useState<Achievement[]>([])
  const [mine, setMine] = useState<MyAchievement[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [allRes, myRes, streakRes]: any = await Promise.all([
        client.get('/achievements'),
        client.get('/achievements/my'),
        client.get('/achievements/streak'),
      ])
      setAll(allRes)
      setMine(myRes)
      setStreak(streakRes.streak)
    } catch (err) {
      console.error('加载成就失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const earnedIds = new Set(mine.map((m) => m.achievementId))

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" />
              我的成就
            </h1>
            <p className="text-sm text-gray-500 mt-1">完成学习和编程挑战，收集徽章吧！</p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="text-sm text-gray-500">已获得徽章</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mine.length} <span className="text-sm font-normal text-gray-400">/ {all.length}</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-amber-600">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">连续学习天数</p>
                <p className="text-2xl font-bold text-gray-900">{streak} 天</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">加载中...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {all.map((ach) => {
                const earned = earnedIds.has(ach.id)
                return (
                  <div
                    key={ach.id}
                    className={`rounded-2xl border p-5 text-center transition ${
                      earned
                        ? 'bg-white border-gray-200 shadow-sm'
                        : 'bg-gray-100 border-gray-200 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${
                        earned ? 'bg-amber-100' : 'bg-gray-200'
                      }`}
                    >
                      {earned ? ach.icon : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    <h3 className={`font-bold text-sm ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {ach.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{ach.description}</p>
                    {earned && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-success font-medium">
                        <Star className="w-3 h-3 fill-current" />
                        已获得
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
