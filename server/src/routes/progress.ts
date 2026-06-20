import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { checkAndAwardAchievements } from './achievements'

const router = Router()
router.use(authMiddleware)

// 获取个人学习进度
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id

    const progress = await prisma.learningProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: { id: true, title: true, chapterId: true },
          include: {
            chapter: {
              select: { id: true, title: true, courseId: true },
              include: {
                course: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    res.json(progress)
  } catch (err: any) {
    res.status(500).json({ error: '获取进度失败', detail: err.message })
  }
})

// 获取某课程的整体进度统计
router.get('/stats', async (req: any, res) => {
  try {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true, streak: true },
    })

    const totalLessons = await prisma.lesson.count()
    const completedLessons = await prisma.learningProgress.count({
      where: { userId, status: 'completed' },
    })

    const totalSubmissions = await prisma.submission.count({ where: { userId } })
    const acceptedSubmissions = await prisma.submission.count({
      where: { userId, result: 'accepted' },
    })

    res.json({
      level: user?.level || 1,
      experience: user?.experience || 0,
      streak: user?.streak || 0,
      totalLessons,
      completedLessons,
      completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      totalSubmissions,
      acceptedSubmissions,
      acRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
    })
  } catch (err: any) {
    res.status(500).json({ error: '获取统计失败', detail: err.message })
  }
})

// 生成学习报告
router.get('/report', async (req: any, res) => {
  try {
    const userId = req.user.id

    // 基础统计
    const totalLessons = await prisma.lesson.count()
    const completedLessons = await prisma.learningProgress.count({
      where: { userId, status: 'completed' },
    })
    const totalSubmissions = await prisma.submission.count({ where: { userId } })
    const acceptedSubmissions = await prisma.submission.count({
      where: { userId, result: 'accepted' },
    })

    // 连续打卡
    const acRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0
    const { getStudyStreak } = await import('./achievements')
    const streak = await getStudyStreak(userId)

    // 最近获得的徽章
    const recentAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
      take: 5,
    })

    // 薄弱知识点（基于错题本）
    const mistakes = await prisma.mistake.findMany({
      where: { userId, reviewed: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // 获取错题关联的题目标题和标签
    const problemIds = mistakes.map(m => m.problemId)
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, title: true, tags: true },
    })
    const problemMap = new Map(problems.map(p => [p.id, p]))

    const weakTags: Record<string, number> = {}
    for (const m of mistakes) {
      const p = problemMap.get(m.problemId)
      if (p?.tags) {
        p.tags.split(',').forEach((tag: string) => {
          const t = tag.trim()
          if (t) weakTags[t] = (weakTags[t] || 0) + 1
        })
      }
    }
    const weakPoints = Object.entries(weakTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    // 生成建议
    const suggestions: string[] = []
    if (streak === 0) {
      suggestions.push('你已经几天没有学习了，今天开始复习一下吧！')
    } else if (streak < 3) {
      suggestions.push('继续保持，连续学习可以形成好习惯！')
    } else {
      suggestions.push('太棒了！你已经连续学习 ' + streak + ' 天，继续保持！')
    }

    if (acRate < 50) {
      suggestions.push('你的 AC 率还有提升空间，建议多复习基础知识，仔细对照示例输入输出。')
    } else if (acRate < 80) {
      suggestions.push('AC 率不错！尝试挑战一些中等难度的题目来突破自己。')
    } else {
      suggestions.push('AC 率很高！你已经掌握了大部分内容，可以尝试更高难度的题目。')
    }

    if (weakPoints.length > 0) {
      suggestions.push(`你的薄弱知识点是：${weakPoints.map((p: any) => p.tag).join('、')}，建议针对性练习。`)
    }

    const report = {
      summary: {
        completedLessons,
        totalLessons,
        completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        totalSubmissions,
        acceptedSubmissions,
        acRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
        streak,
      },
      recentAchievements: recentAchievements.map((a: any) => ({
        name: a.achievement.name,
        icon: a.achievement.icon,
        earnedAt: a.earnedAt,
      })),
      weakPoints,
      recentMistakes: mistakes.slice(0, 5).map((m: any) => ({
        problemId: m.problemId,
        problemTitle: problemMap.get(m.problemId)?.title,
        errorType: m.errorType,
        createdAt: m.createdAt,
      })),
      suggestions,
    }

    res.json(report)
  } catch (err: any) {
    res.status(500).json({ error: '生成报告失败', detail: err.message })
  }
})

// 标记课时完成
router.post('/complete', async (req: any, res) => {
  try {
    const userId = req.user.id
    const { lessonId } = req.body

    if (!lessonId) {
      return res.status(400).json({ error: '缺少课时ID' })
    }

    const progress = await prisma.learningProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        status: 'completed',
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        status: 'completed',
        completedAt: new Date(),
      },
    })

    // 检查并颁发徽章
    await checkAndAwardAchievements(userId)

    res.json(progress)
  } catch (err: any) {
    res.status(500).json({ error: '标记完成失败', detail: err.message })
  }
})

export default router
