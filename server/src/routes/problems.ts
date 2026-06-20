import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 将逗号分隔的 tags 字符串转为数组
function formatTags(problem: any): any {
  if (problem && typeof problem.tags === 'string') {
    problem.tags = problem.tags
      .split(/[,，]/)
      .map((t: string) => t.trim())
      .filter(Boolean)
  }
  return problem
}

// 获取题目列表（支持按 GESP 级别筛选）
router.get('/', async (req: any, res) => {
  try {
    const tenantId = req.tenantId
    const { level, difficulty, search } = req.query

    const where: any = { tenantId, status: 'active' }
    if (level) where.gespLevel = parseInt(level as string)
    if (difficulty) where.difficulty = difficulty
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const problems = await prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
        gespLevel: true,
        timeLimit: true,
        memoryLimit: true,
        createdAt: true,
      },
      orderBy: { gespLevel: 'asc' },
    })

    res.json(problems.map(formatTags))
  } catch (err: any) {
    res.status(500).json({ error: '获取题目失败', detail: err.message })
  }
})

// 获取题目详情（学生视角：只返回样例测试）
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params
    const tenantId = req.tenantId

    const problem = await prisma.problem.findFirst({
      where: { id, tenantId },
      include: {
        testCases: {
          where: { isHidden: false },
          select: { id: true, input: true, expectedOutput: true, isHidden: true },
        },
      },
    })

    if (!problem) return res.status(404).json({ error: '题目不存在' })
    res.json(formatTags(problem))
  } catch (err: any) {
    res.status(500).json({ error: '获取题目详情失败', detail: err.message })
  }
})

// 获取题目完整详情（教师视角：包含隐藏测试用例）
router.get('/:id/full', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { id } = req.params
    const tenantId = req.tenantId

    const problem = await prisma.problem.findFirst({
      where: { id, tenantId },
      include: {
        testCases: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!problem) return res.status(404).json({ error: '题目不存在' })
    res.json(formatTags(problem))
  } catch (err: any) {
    res.status(500).json({ error: '获取题目详情失败', detail: err.message })
  }
})

// 创建题目（教师/管理员）
router.post('/', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const tenantId = req.tenantId
    const data = req.body

    const problem = await prisma.problem.create({
      data: {
        tenantId,
        ...data,
      },
    })

    res.json(problem)
  } catch (err: any) {
    res.status(500).json({ error: '创建题目失败', detail: err.message })
  }
})

// 更新题目（教师/管理员）
router.put('/:id', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { id } = req.params
    const tenantId = req.tenantId
    const data = req.body

    const problem = await prisma.problem.updateMany({
      where: { id, tenantId },
      data,
    })

    res.json({ message: '更新成功', count: problem.count })
  } catch (err: any) {
    res.status(500).json({ error: '更新题目失败', detail: err.message })
  }
})

// 删除题目（教师/管理员）
router.delete('/:id', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { id } = req.params
    const tenantId = req.tenantId

    // 先删除关联的测试用例和提交记录
    await prisma.testCase.deleteMany({ where: { problemId: id } })
    await prisma.submission.deleteMany({ where: { problemId: id } })
    await prisma.mistake.deleteMany({ where: { problemId: id } })

    await prisma.problem.deleteMany({
      where: { id, tenantId },
    })

    res.json({ message: '删除成功' })
  } catch (err: any) {
    res.status(500).json({ error: '删除题目失败', detail: err.message })
  }
})

// 批量导入题目（教师/管理员）
// 请求体: { problems: [{ title, description, testCases: [{ input, expectedOutput, score, isHidden }] }] }
router.post('/import', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const tenantId = req.tenantId
    const { problems } = req.body

    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ error: '缺少题目数据' })
    }

    const results = []
    const errors = []

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i]
      try {
        if (!p.title || !p.description) {
          throw new Error('缺少标题或描述')
        }

        // 创建题目
        const problem = await prisma.problem.create({
          data: {
            tenantId,
            title: p.title,
            description: p.description,
            inputDesc: p.inputDesc || '',
            outputDesc: p.outputDesc || '',
            sampleInput: p.sampleInput || '',
            sampleOutput: p.sampleOutput || '',
            sampleExplanation: p.sampleExplanation || '',
            starterCode: p.starterCode || '',
            difficulty: p.difficulty || 'easy',
            tags: p.tags || '',
            gespLevel: p.gespLevel || 1,
            timeLimit: p.timeLimit || 1000,
            memoryLimit: p.memoryLimit || 128,
          },
        })

        // 创建测试用例
        const testCases = p.testCases || []
        if (testCases.length === 0) {
          throw new Error('缺少测试用例')
        }

        const totalScore = testCases.reduce((sum: number, tc: any) => sum + (tc.score || 0), 0)
        if (totalScore !== 100) {
          // 自动均分分值
          const perScore = Math.floor(100 / testCases.length)
          testCases.forEach((tc: any, idx: number) => {
            tc.score = idx === testCases.length - 1 ? 100 - perScore * (testCases.length - 1) : perScore
          })
        }

        for (let j = 0; j < testCases.length; j++) {
          const tc = testCases[j]
          await prisma.testCase.create({
            data: {
              problemId: problem.id,
              input: tc.input || '',
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden ?? j > 0, // 默认第一个为样例，其余隐藏
              score: tc.score || Math.floor(100 / testCases.length),
              sortOrder: j + 1,
            },
          })
        }

        results.push({ index: i, problemId: problem.id, title: problem.title })
      } catch (err: any) {
        errors.push({ index: i, title: p.title, error: err.message })
      }
    }

    res.json({
      imported: results.length,
      failed: errors.length,
      results,
      errors,
    })
  } catch (err: any) {
    res.status(500).json({ error: '批量导入失败', detail: err.message })
  }
})

export default router
