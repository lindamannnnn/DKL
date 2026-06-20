import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'
import { judgeCode } from '../services/judgeService'
import { analyzeCompileError, getFriendlyResult } from '../services/errorRules'
import { generateAIFeedback } from '../services/aiFeedbackService'
import { checkAndAwardAchievements } from './achievements'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 提交代码评测
router.post('/', async (req: any, res) => {
  try {
    const userId = req.user.id
    const { problemId, code, language = 'cpp', lessonId } = req.body

    if (!problemId || !code) {
      return res.status(400).json({ error: '缺少题目ID或代码' })
    }

    // 获取题目和测试用例
    const problem = await prisma.problem.findFirst({
      where: { id: problemId, tenantId: req.tenantId },
      include: {
        testCases: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!problem) return res.status(404).json({ error: '题目不存在' })

    // 获取当前课时标题（用于限制 AI 不超纲）
    let lessonTitle = ''
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
      if (lesson) lessonTitle = lesson.title
    }

    // 调用 JudgeServer 评测
    const judgeResult = await judgeCode({
      src: code,
      language,
      testCases: problem.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
    })

    // 计算结果类型
    const resultType = judgeResult.passed
      ? 'accepted'
      : judgeResult.compileError
      ? 'compile_error'
      : 'wrong_answer'

    // 编译错误时先用规则引擎分析错误原因（只取 message，修复建议 hint 不直接给学生，留给 AI 引导）
    let ruleFeedback = ''
    if (judgeResult.compileError) {
      const errorAnalysis = analyzeCompileError(judgeResult.compileError)
      if (errorAnalysis) {
        ruleFeedback = errorAnalysis.message
      }
    }

    // 非 AC 时自动调用 AI 老师生成引导式反馈
    let aiFeedback = ruleFeedback
    if (!judgeResult.passed) {
      const aiResult = await generateAIFeedback({
        problemTitle: problem.title,
        code,
        result: resultType,
        compileError: judgeResult.compileError,
        passedCount: judgeResult.results.filter((r: any) => r.status === 'Accepted').length,
        totalCount: judgeResult.results.length,
        details: judgeResult.results.map((r: any) => ({
          status: r.status,
          input: r.input,
          expectedOutput: r.expectedOutput,
          actualOutput: r.actualOutput,
        })),
        ruleFeedback: ruleFeedback || undefined,
        lessonTitle: lessonTitle || undefined,
      })
      if (aiResult) {
        aiFeedback = aiResult
      }
    }

    // 保存提交记录
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        language,
        result: resultType,
        passedCount: judgeResult.results.filter((r: any) => r.status === 'Accepted').length,
        totalCount: judgeResult.results.length,
        score: judgeResult.score,
        timeUsed: Math.max(...judgeResult.results.map((r: any) => r.timeUsed), 0),
        memoryUsed: Math.max(...judgeResult.results.map((r: any) => r.memoryUsed), 0),
        compileError: judgeResult.compileError,
        aiFeedback,
      },
    })

    // 提交通过后检查徽章
    let newBadges: any[] = []
    if (judgeResult.passed) {
      await checkAndAwardAchievements(userId)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const myAchievements = await prisma.userAchievement.findMany({
        where: { userId, earnedAt: { gt: oneDayAgo } },
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' },
      })
      newBadges = myAchievements.map((a) => ({
        id: a.achievement.id,
        name: a.achievement.name,
        icon: a.achievement.icon,
        description: a.achievement.description,
      }))
    }

    // 如果错误，记录到错题本
    if (!judgeResult.passed) {
      await prisma.mistake.upsert({
        where: { userId_problemId: { userId, problemId } },
        update: {
          submissionId: submission.id,
          userCode: code,
          errorType: judgeResult.compileError ? 'compile_error' : 'wrong_answer',
          reviewed: false,
        },
        create: {
          userId,
          problemId,
          submissionId: submission.id,
          userCode: code,
          errorType: judgeResult.compileError ? 'compile_error' : 'wrong_answer',
        },
      })
    }

    // 返回友好结果
    const friendlyResult = getFriendlyResult(
      submission.result,
      submission.passedCount,
      submission.totalCount
    )

    res.json({
      submission,
      details: judgeResult.results,
      friendlyResult,
      newBadges,
    })
  } catch (err: any) {
    console.error('Submission error:', err)
    res.status(500).json({ error: '提交评测失败', detail: err.message })
  }
})

// 获取提交记录
router.get('/', async (req: any, res) => {
  try {
    const userId = req.user.id
    const submissions = await prisma.submission.findMany({
      where: { userId },
      include: {
        problem: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    res.json(submissions)
  } catch (err: any) {
    res.status(500).json({ error: '获取提交记录失败', detail: err.message })
  }
})

// 获取提交详情
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const submission = await prisma.submission.findFirst({
      where: { id, userId },
      include: {
        problem: true,
      },
    })

    if (!submission) return res.status(404).json({ error: '提交记录不存在' })
    res.json(submission)
  } catch (err: any) {
    res.status(500).json({ error: '获取提交详情失败', detail: err.message })
  }
})

export default router
