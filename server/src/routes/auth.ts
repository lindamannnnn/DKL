import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dkl-dev-secret'
const JWT_EXPIRES = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn']

// 注册
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, role = 'student', tenantId } = req.body

    if (!email || !username || !password || !tenantId) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    // 检查邮箱是否已存在（同一租户内）
    const existing = await prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    })
    if (existing) {
      return res.status(409).json({ error: '该邮箱已被注册' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        tenantId,
        email,
        username,
        password: hashed,
        role,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({ user, token })
  } catch (err: any) {
    console.error('Register error:', err)
    res.status(500).json({ error: '注册失败', detail: err.message })
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password, tenantId } = req.body

    if (!email || !password || !tenantId) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    const user = await prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    })

    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: '邮箱或密码错误' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        tenantId: user.tenantId,
      },
      token,
    })
  } catch (err: any) {
    console.error('Login error:', err)
    res.status(500).json({ error: '登录失败', detail: err.message })
  }
})

// 获取当前用户
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: '未登录' })

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true, role: true, tenantId: true },
    })

    if (!user) return res.status(401).json({ error: '用户不存在' })
    res.json({ user })
  } catch {
    res.status(401).json({ error: '登录已过期' })
  }
})

export default router
