import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// 获取所有徽章定义
router.get('/', async (_req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'asc' },
    })
    res.json(achievements)
  } catch (err: any) {
    res.status(500).json({ error: '获取徽章失败', detail: err.message })
  }
})

// 获取我的徽章
router.get('/my', async (req: any, res) => {
  try {
    const userId = req.user.id

    const myAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    })

    res.json(myAchievements)
  } catch (err: any) {
    res.status(500).json({ error: '获取我的徽章失败', detail: err.message })
  }
})

// 获取连续学习天数
router.get('/streak', async (req: any, res) => {
  try {
    const userId = req.user.id
    const streak = await getStudyStreak(userId)
    res.json({ streak })
  } catch (err: any) {
    res.status(500).json({ error: '获取连续天数失败', detail: err.message })
  }
})

// 计算用户连续学习天数
export async function getStudyStreak(userId: string): Promise<number> {
  const progressList = await prisma.learningProgress.findMany({
    where: { userId, status: 'completed' },
    select: { updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  if (progressList.length === 0) return 0

  // 提取日期字符串（去重）
  const dateSet = new Set<string>()
  for (const p of progressList) {
    const d = new Date(p.updatedAt)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    dateSet.add(dateStr)
  }
  const dates = Array.from(dateSet).sort().reverse() // 从新到旧

  // 计算从今天往前的连续天数
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  let streak = 0
  let checkDate = new Date(todayStr)

  for (const dateStr of dates) {
    const d = new Date(dateStr)
    const diffDays = Math.round((checkDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    // 第一次允许今天(0)或昨天(1)，之后必须正好连续（diffDays === 0 因为 checkDate 已前移）
    const allowedDiff = streak === 0 ? 1 : 0
    if (diffDays >= 0 && diffDays <= allowedDiff) {
      streak++
      checkDate = new Date(d.getTime() - 24 * 60 * 60 * 1000)
    } else {
      break
    }
  }

  return streak
}

// 检查并颁发徽章（内部调用）
export async function checkAndAwardAchievements(userId: string) {
  const achievements = await prisma.achievement.findMany()

  for (const ach of achievements) {
    const alreadyHas = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: ach.id } },
    })
    if (alreadyHas) continue

    const condition = JSON.parse(ach.condition)
    let shouldAward = false

    if (condition.type === 'complete_lesson') {
      const count = await prisma.learningProgress.count({
        where: { userId, status: 'completed' },
      })
      shouldAward = count >= condition.count
    } else if (condition.type === 'ac_problem') {
      const count = await prisma.submission.count({
        where: { userId, result: 'accepted' },
      })
      shouldAward = count >= condition.count
    } else if (condition.type === 'streak') {
      const streak = await getStudyStreak(userId)
      shouldAward = streak >= condition.days
    } else if (condition.type === 'complete_tag') {
      // 基于用户通过的题目标签来判断
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { tenantId: true } })
      if (!user) continue

      const taggedProblems = await prisma.problem.findMany({
        where: {
          tenantId: user.tenantId,
          tags: { contains: condition.tag },
        },
        select: { id: true },
      })
      const problemIds = taggedProblems.map(p => p.id)

      // 检查用户是否至少通过了一道这类题目
      if (problemIds.length > 0) {
        const acCount = await prisma.submission.count({
          where: { userId, result: 'accepted', problemId: { in: problemIds } },
        })
        shouldAward = acCount >= 1
      }
    }

    if (shouldAward) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id },
      })
    }
  }
}

export default router
