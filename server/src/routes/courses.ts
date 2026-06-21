import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'

const router = Router()

// 所有课程路由需要认证 + 多租户
router.use(authMiddleware)
router.use(tenantMiddleware)

// 获取课程列表（包含当前用户进度）
router.get('/', async (req: any, res) => {
  try {
    const tenantId = req.tenantId
    const userId = req.user.id

    const courses = await prisma.course.findMany({
      where: { tenantId, status: 'published' },
      include: {
        chapters: {
          include: {
            lessons: {
              select: { id: true, title: true, sortOrder: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // 获取该用户所有已完成课时
    const completedProgress = await prisma.learningProgress.findMany({
      where: { userId, status: 'completed' },
      select: { lessonId: true },
    })
    const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId))

    const coursesWithProgress = courses.map((course) => {
      const allLessonIds: string[] = []
      course.chapters.forEach((ch) => ch.lessons.forEach((l) => allLessonIds.push(l.id)))
      const completed = allLessonIds.filter((id) => completedLessonIds.has(id)).length
      const total = allLessonIds.length
      return {
        ...course,
        progress: {
          completed,
          total,
          rate: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      }
    })

    res.json(coursesWithProgress)
  } catch (err: any) {
    res.status(500).json({ error: '获取课程失败', detail: err.message })
  }
})

// 获取单个课程详情（包含当前用户课时进度）
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params
    const tenantId = req.tenantId
    const userId = req.user.id

    const course = await prisma.course.findFirst({
      where: { id, tenantId },
      include: {
        chapters: {
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!course) return res.status(404).json({ error: '课程不存在' })

    const progress = await prisma.learningProgress.findMany({
      where: { userId },
      select: { lessonId: true, status: true },
    })
    const progressMap = new Map(progress.map((p) => [p.lessonId, p.status]))

    const courseWithProgress = {
      ...course,
      chapters: course.chapters.map((ch) => ({
        ...ch,
        lessons: ch.lessons.map((l) => ({
          ...l,
          status: progressMap.get(l.id) || 'not_started',
        })),
      })),
    }

    res.json(courseWithProgress)
  } catch (err: any) {
    res.status(500).json({ error: '获取课程详情失败', detail: err.message })
  }
})

// 创建课程（教师/管理员）
router.post('/', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { title, description, levelMin = 1, levelMax = 8 } = req.body
    const tenantId = req.tenantId

    const course = await prisma.course.create({
      data: {
        tenantId,
        title,
        description,
        levelMin,
        levelMax,
        status: 'draft',
      },
    })

    res.json(course)
  } catch (err: any) {
    res.status(500).json({ error: '创建课程失败', detail: err.message })
  }
})

// 上传课件并解析（教师/管理员）
router.post('/import', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { markdown, courseId } = req.body
    const tenantId = req.tenantId

    // TODO: 调用 markdownParser 解析
    // 这里先返回占位
    res.json({ message: '课件导入功能待实现', markdownLength: markdown?.length })
  } catch (err: any) {
    res.status(500).json({ error: '导入失败', detail: err.message })
  }
})

export default router
