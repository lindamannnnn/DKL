import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 创建班级
router.post('/', async (req: any, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: '权限不足' })
    }

    const { name } = req.body
    const tenantId = req.tenantId
    const teacherId = req.user.id

    // 生成随机邀请码
    const inviteCode = 'DKL' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const cls = await prisma.class.create({
      data: {
        tenantId,
        teacherId,
        name,
        inviteCode,
      },
    })

    res.json(cls)
  } catch (err: any) {
    res.status(500).json({ error: '创建班级失败', detail: err.message })
  }
})

// 获取教师创建的班级列表
router.get('/', async (req: any, res) => {
  try {
    const tenantId = req.tenantId
    const teacherId = req.user.id

    const classes = await prisma.class.findMany({
      where: { tenantId, teacherId },
      include: {
        students: true,
        courses: {
          include: { course: { select: { id: true, title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(classes)
  } catch (err: any) {
    res.status(500).json({ error: '获取班级失败', detail: err.message })
  }
})

// 学生加入班级
router.post('/:id/join', async (req: any, res) => {
  try {
    const { inviteCode } = req.body
    const studentId = req.user.id

    const cls = await prisma.class.findFirst({
      where: { inviteCode },
    })

    if (!cls) {
      return res.status(404).json({ error: '邀请码无效' })
    }

    const membership = await prisma.classStudent.upsert({
      where: { classId_studentId: { classId: cls.id, studentId } },
      update: {},
      create: { classId: cls.id, studentId },
    })

    res.json({ message: '加入成功', classId: cls.id })
  } catch (err: any) {
    res.status(500).json({ error: '加入班级失败', detail: err.message })
  }
})

// 获取班级学生列表
router.get('/:id/students', async (req: any, res) => {
  try {
    const { id } = req.params
    const tenantId = req.tenantId

    const cls = await prisma.class.findFirst({
      where: { id, tenantId },
      include: {
        students: {
          include: {
            student: {
              select: { id: true, username: true, email: true },
            },
          },
        },
      },
    })

    if (!cls) return res.status(404).json({ error: '班级不存在' })
    res.json(cls.students)
  } catch (err: any) {
    res.status(500).json({ error: '获取学生列表失败', detail: err.message })
  }
})

export default router
