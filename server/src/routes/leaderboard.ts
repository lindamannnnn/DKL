import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 获取排行榜（按 AC 题目总分排名）
router.get('/', async (req: any, res) => {
  try {
    const tenantId = req.tenantId

    // 获取当前租户的所有用户
    const tenantUsers = await prisma.user.findMany({
      where: { tenantId },
      select: { id: true },
    })
    const userIds = tenantUsers.map((u: any) => u.id)

    // 聚合每个学生的通过提交总分
    const rankings = await prisma.submission.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds }, result: 'accepted' },
      _sum: { score: true },
      _count: { id: true },
      orderBy: { _sum: { score: 'desc' } },
      take: 50,
    })

    // 获取用户信息
    const rankingUserIds = rankings.map((r: any) => r.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: rankingUserIds } },
      select: { id: true, username: true },
    })
    const userMap = new Map(users.map((u: any) => [u.id, u]))

    const leaderboard = rankings.map((r: any, idx: number) => ({
      rank: idx + 1,
      studentId: r.userId,
      username: userMap.get(r.userId)?.username || '未知用户',
      totalScore: r._sum.score || 0,
      acceptedCount: r._count.id,
    }))

    res.json({ leaderboard })
  } catch (err: any) {
    res.status(500).json({ error: '获取排行榜失败', detail: err.message })
  }
})

export default router
