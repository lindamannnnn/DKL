import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth'

// 多租户中间件：从请求头或子域名提取 tenant
export const tenantMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'] as string || req.user?.tenantId

  if (!tenantId) {
    return res.status(400).json({ error: '缺少租户标识' })
  }

  // 将 tenantId 附加到请求中，供后续使用
  ;(req as any).tenantId = tenantId
  next()
}
