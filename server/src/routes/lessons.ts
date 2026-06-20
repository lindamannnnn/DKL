import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'
import { parseLessonPages } from '../parsers/markdownParser'
import { checkAndAwardAchievements, getStudyStreak } from './achievements'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 获取课时内容
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: true,
            lessons: {
              select: { id: true, title: true, sortOrder: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    })

    if (!lesson) return res.status(404).json({ error: '课时不存在' })

    // 获取该用户的学习进度
    const progress = await prisma.learningProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: id } },
    })

    // 将内容按 ## 标题分页，支持幻灯片式课件
    const pages = parseLessonPages(lesson.rawMarkdown || '')

    res.json({ ...lesson, pages, progress })
  } catch (err: any) {
    res.status(500).json({ error: '获取课时失败', detail: err.message })
  }
})

// 标记课时完成
router.post('/:id/complete', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { xpReward: true, rewards: true },
    })

    const progress = await prisma.learningProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: id } },
      update: { status: 'completed', completedAt: new Date() },
      create: {
        userId,
        lessonId: id,
        status: 'completed',
        completedAt: new Date(),
      },
    })

    // 更新经验值和连续学习
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null
      lastStudy?.setHours(0, 0, 0, 0)

      let streak = user.streak
      if (!lastStudy) {
        streak = 1
      } else {
        const diffDays = Math.round((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) {
          // 今天已经学习过，streak 不变
        } else if (diffDays === 1) {
          streak += 1
        } else {
          streak = 1
        }
      }

      const xpGained = lesson?.xpReward || 10
      const extraRewards = (lesson?.rewards as any) || {}
      const totalXp = user.experience + xpGained + (extraRewards.xp || 0)
      const newLevel = Math.floor(totalXp / 100) + 1
      const levelUp = newLevel > user.level

      await prisma.user.update({
        where: { id: userId },
        data: {
          experience: totalXp,
          level: newLevel,
          streak,
          lastStudyDate: new Date(),
        },
      })

      // 检查徽章
      await checkAndAwardAchievements(userId)
      const myAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' },
        take: 10,
      })

      // 这里简化：返回最近 1 天内获得的新徽章
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const newBadges = myAchievements
        .filter((a) => a.earnedAt > oneDayAgo)
        .map((a) => ({
          id: a.achievement.id,
          name: a.achievement.name,
          icon: a.achievement.icon,
          description: a.achievement.description,
        }))

      res.json({
        progress,
        xpGained,
        levelUp,
        newLevel: levelUp ? newLevel : undefined,
        newBadges,
      })
    } else {
      res.json(progress)
    }
  } catch (err: any) {
    res.status(500).json({ error: '标记完成失败', detail: err.message })
  }
})

// 获取课时关联的所有编程题
router.get('/:id/problems', async (req: any, res) => {
  try {
    const { id } = req.params

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { content: true },
    })

    if (!lesson) return res.status(404).json({ error: '课时不存在' })

    const blocks = Array.isArray(lesson.content) ? lesson.content : []
    const problemIds = blocks
      .filter((b: any) => b.type === 'problem' && b.metadata?.problemId)
      .map((b: any) => b.metadata.problemId)

    if (problemIds.length === 0) {
      return res.json([])
    }

    const problems = await prisma.problem.findMany({
      where: {
        id: { in: problemIds },
        tenantId: req.tenantId,
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        timeLimit: true,
        memoryLimit: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json(problems)
  } catch (err: any) {
    res.status(500).json({ error: '获取课时题目失败', detail: err.message })
  }
})

export default router
