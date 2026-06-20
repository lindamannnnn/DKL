import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'
import { judgeCode } from '../services/judgeService'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 获取考试列表
router.get('/', async (req: any, res) => {
  try {
    const tenantId = req.tenantId
    const user = req.user

    let exams: any[]
    if (user.role === 'student') {
      // 学生：只看已发布的考试
      exams = await prisma.exam.findMany({
        where: { tenantId, status: 'published' },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          totalScore: true,
          gespLevel: true,
          status: true,
          createdAt: true,
          _count: { select: { problems: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      // 检查学生是否已参加过
      const studentExams = await prisma.studentExam.findMany({
        where: { studentId: user.id },
        select: { examId: true, status: true, score: true },
      })
      const seMap = new Map(studentExams.map((se: any) => [se.examId, se]))

      exams = exams.map((e: any) => ({
        ...e,
        participated: seMap.has(e.id),
        myScore: seMap.get(e.id)?.score || 0,
        myStatus: seMap.get(e.id)?.status || null,
      }))
    } else {
      // 教师/管理员：看自己创建的
      exams = await prisma.exam.findMany({
        where: { tenantId, createdBy: user.id },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          totalScore: true,
          gespLevel: true,
          status: true,
          createdAt: true,
          _count: { select: { problems: true, studentExams: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    res.json(exams)
  } catch (err: any) {
    res.status(500).json({ error: '获取考试列表失败', detail: err.message })
  }
})

// 获取考试详情
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params
    const tenantId = req.tenantId
    const user = req.user

    const where: any = { id, tenantId }
    if (user.role === 'student') {
      where.status = 'published'
    }

    const exam = await prisma.exam.findFirst({
      where,
      include: {
        problems: {
          orderBy: { sortOrder: 'asc' },
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                description: true,
                inputDesc: true,
                outputDesc: true,
                sampleInput: true,
                sampleOutput: true,
                sampleExplanation: true,
                starterCode: true,
                difficulty: true,
                tags: true,
                timeLimit: true,
                memoryLimit: true,
              },
            },
          },
        },
      },
    })

    if (!exam) return res.status(404).json({ error: '考试不存在' })

    // 学生：检查是否已参加过
    let studentExam = null
    if (user.role === 'student') {
      studentExam = await prisma.studentExam.findUnique({
        where: { studentId_examId: { studentId: user.id, examId: id } },
      })
    }

    res.json({ ...exam, studentExam })
  } catch (err: any) {
    res.status(500).json({ error: '获取考试详情失败', detail: err.message })
  }
})

// 创建考试（教师/管理员）
router.post('/', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const tenantId = req.tenantId
    const { title, description, duration, gespLevel, problemIds } = req.body

    if (!title || !problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: '缺少标题或题目' })
    }

    // 验证题目存在
    const problems = await prisma.problem.findMany({
      where: { id: { in: problemIds }, tenantId },
    })
    if (problems.length !== problemIds.length) {
      return res.status(400).json({ error: '部分题目不存在' })
    }

    // 计算总分（均分，最后一个题目拿余数）
    const perScore = Math.floor(100 / problemIds.length)
    const remainder = 100 - perScore * (problemIds.length - 1)
    const totalScore = 100

    const exam = await prisma.exam.create({
      data: {
        tenantId,
        title,
        description: description || '',
        duration: duration || 60,
        totalScore,
        gespLevel: gespLevel || 1,
        status: 'draft',
        createdBy: req.user.id,
      },
    })

    // 创建考试题目关联
    for (let i = 0; i < problemIds.length; i++) {
      await prisma.examProblem.create({
        data: {
          examId: exam.id,
          problemId: problemIds[i],
          sortOrder: i + 1,
          score: i === problemIds.length - 1 ? remainder : perScore,
        },
      })
    }

    res.json({ message: '创建成功', examId: exam.id })
  } catch (err: any) {
    res.status(500).json({ error: '创建考试失败', detail: err.message })
  }
})

// 发布考试（教师/管理员）
router.post('/:id/publish', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { id } = req.params
    const tenantId = req.tenantId

    const updated = await prisma.exam.updateMany({
      where: { id, tenantId, createdBy: req.user.id },
      data: { status: 'published' },
    })

    if (updated.count === 0) {
      return res.status(404).json({ error: '考试不存在或无权限' })
    }

    res.json({ message: '发布成功' })
  } catch (err: any) {
    res.status(500).json({ error: '发布失败', detail: err.message })
  }
})

// 开始考试（学生）
router.post('/:id/start', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const tenantId = req.tenantId

    const exam = await prisma.exam.findFirst({
      where: { id, tenantId, status: 'published' },
    })
    if (!exam) return res.status(404).json({ error: '考试不存在或未发布' })

    // 检查是否已开始过
    let studentExam = await prisma.studentExam.findUnique({
      where: { studentId_examId: { studentId: userId, examId: id } },
    })

    if (!studentExam) {
      studentExam = await prisma.studentExam.create({
        data: {
          studentId: userId,
          examId: id,
          status: 'in_progress',
        },
      })
    }

    res.json(studentExam)
  } catch (err: any) {
    res.status(500).json({ error: '开始考试失败', detail: err.message })
  }
})

// 提交答案（学生）
router.post('/:id/submit', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const tenantId = req.tenantId
    const { answers } = req.body // { problemId: { code, language } }

    const exam = await prisma.exam.findFirst({
      where: { id, tenantId, status: 'published' },
      include: {
        problems: {
          include: {
            problem: {
              include: { testCases: true },
            },
          },
        },
      },
    })
    if (!exam) return res.status(404).json({ error: '考试不存在' })

    let studentExam = await prisma.studentExam.findUnique({
      where: { studentId_examId: { studentId: userId, examId: id } },
    })
    if (!studentExam) return res.status(400).json({ error: '尚未开始考试' })
    if (studentExam.status === 'submitted') {
      return res.status(400).json({ error: '已提交，不可重复提交' })
    }

    // 逐题判题
    const results: Record<string, any> = {}
    let totalScore = 0

    for (const ep of exam.problems) {
      const problem = ep.problem
      const answer = answers?.[problem.id]
      if (!answer || !answer.code) {
        results[problem.id] = { passed: false, score: 0, status: '未作答' }
        continue
      }

      try {
        const judgeResult = await judgeCode({
          src: answer.code,
          language: answer.language || 'C++',
          testCases: problem.testCases.map((tc: any) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
          })),
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
        })

        const passed = judgeResult.passed
        const score = passed ? ep.score : 0
        totalScore += score

        results[problem.id] = {
          passed,
          score,
          status: judgeResult.compileError ? '编译错误' : (passed ? '通过' : '答案错误'),
          details: judgeResult.results,
          compileError: judgeResult.compileError,
        }
      } catch (err: any) {
        results[problem.id] = { passed: false, score: 0, status: '系统错误', error: err.message }
      }
    }

    // 更新学生考试记录
    await prisma.studentExam.update({
      where: { id: studentExam.id },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
        score: totalScore,
        answers,
        results,
      },
    })

    res.json({
      message: '提交成功',
      score: totalScore,
      totalScore: exam.totalScore,
      results,
    })
  } catch (err: any) {
    res.status(500).json({ error: '提交失败', detail: err.message })
  }
})

// 获取考试结果（学生看自己的）
router.get('/:id/result', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const studentExam = await prisma.studentExam.findUnique({
      where: { studentId_examId: { studentId: userId, examId: id } },
      include: {
        exam: {
          select: { id: true, title: true, duration: true, totalScore: true },
        },
      },
    })

    if (!studentExam) return res.status(404).json({ error: '未找到考试记录' })

    res.json(studentExam)
  } catch (err: any) {
    res.status(500).json({ error: '获取结果失败', detail: err.message })
  }
})

// 教师查看考试统计
router.get('/:id/stats', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { id } = req.params
    const tenantId = req.tenantId

    const exam = await prisma.exam.findFirst({
      where: { id, tenantId, createdBy: req.user.id },
      include: {
        studentExams: {
          include: {
            student: { select: { id: true, username: true, email: true } },
          },
          orderBy: { score: 'desc' },
        },
      },
    })

    if (!exam) return res.status(404).json({ error: '考试不存在' })

    const totalStudents = exam.studentExams.length
    const avgScore = totalStudents > 0
      ? Math.round(exam.studentExams.reduce((sum: number, se: any) => sum + se.score, 0) / totalStudents)
      : 0

    res.json({
      exam: { id: exam.id, title: exam.title, totalScore: exam.totalScore },
      totalStudents,
      avgScore,
      rankings: exam.studentExams.map((se: any) => ({
        studentId: se.student.id,
        username: se.student.username,
        score: se.score,
        status: se.status,
        submittedAt: se.submittedAt,
      })),
    })
  } catch (err: any) {
    res.status(500).json({ error: '获取统计失败', detail: err.message })
  }
})

export default router
