import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
    tenantId: string
  }
}

const DEFAULT_DEV_USER = {
  id: 'dev-user-id',
  email: 'dev@dkl.local',
  role: 'student',
  tenantId: process.env.DEFAULT_TENANT_ID || '080ffa34-df87-4566-b1ef-555b88bfe5b8',
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  // 开发环境下自动使用默认测试用户，无需登录
  if (process.env.NODE_ENV === 'development') {
    if (!token) {
      req.user = DEFAULT_DEV_USER
      return next()
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      req.user = decoded
      return next()
    } catch {
      req.user = DEFAULT_DEV_USER
      return next()
    }
  }

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: '认证令牌无效' })
  }
}

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: '权限不足' })
    }
    next()
  }
}
