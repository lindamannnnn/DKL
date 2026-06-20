import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// 获取错题本
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id

    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // 获取关联的题目标题和标签
    const problemIds = mistakes.map(m => m.problemId)
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, title: true, difficulty: true, gespLevel: true },
    })
    const problemMap = new Map(problems.map(p => [p.id, p]))

    const enrichedMistakes = mistakes.map(m => ({
      ...m,
      problem: problemMap.get(m.problemId) || null,
    }))

    res.json(enrichedMistakes)
  } catch (err: any) {
    res.status(500).json({ error: '获取错题本失败', detail: err.message })
  }
})

// 标记错题已复习
router.post('/:id/review', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const mistake = await prisma.mistake.updateMany({
      where: { id, userId },
      data: { reviewed: true, reviewedAt: new Date() },
    })

    res.json({ message: '已标记复习' })
  } catch (err: any) {
    res.status(500).json({ error: '标记失败', detail: err.message })
  }
})

export default router
