import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'

const router = Router()

// 所有课程路由需要认证 + 多租户
router.use(authMiddleware)
router.use(tenantMiddleware)

// 获取课程列表
router.get('/', async (req: any, res) => {
  try {
    const tenantId = req.tenantId
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
    res.json(courses)
  } catch (err: any) {
    res.status(500).json({ error: '获取课程失败', detail: err.message })
  }
})

// 获取单个课程详情
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params
    const tenantId = req.tenantId

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
    res.json(course)
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
