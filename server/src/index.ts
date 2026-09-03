import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth'
import courseRoutes from './routes/courses'
import lessonRoutes from './routes/lessons'
import problemRoutes from './routes/problems'
import submissionRoutes from './routes/submissions'
import aiRoutes from './routes/ai'
import classRoutes from './routes/classes'
import progressRoutes from './routes/progress'
import achievementRoutes from './routes/achievements'
import mistakeRoutes from './routes/mistakes'
import examRoutes from './routes/exams'
import leaderboardRoutes from './routes/leaderboard'
import knowledgeRoutes from './routes/knowledge'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4001

// CORS 白名单配置
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000']

app.use(cors({
  origin: (origin, callback) => {
    // 允许无 Origin 的请求（如 Postman、curl）
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// Helmet 安全头（保留必要配置用于前端开发）
app.use(helmet({
  contentSecurityPolicy: false, // 开发环境关闭 CSP，避免前端资源加载问题
  crossOriginEmbedderPolicy: false,
}))

// 请求体解析
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 请求日志（开发环境）
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`)
    next()
  })
}

// API 限流配置
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 200, // 每 IP 200 请求
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 登录/注册更严格
  message: { error: '登录尝试过于频繁，请15分钟后再试' },
  skipSuccessfulRequests: true, // 成功请求不计入限流
})

const judgeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 判题限制，防止压垮 JudgeServer
  message: { error: '提交过于频繁，请稍后再试' },
})

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 10, // AI 对话更严格（节省 API 费用）
  message: { error: 'AI 对话过于频繁，请稍后再试' },
})

app.use(generalLimiter)
app.use('/api/auth', authLimiter)
app.use('/api/submissions', judgeLimiter)
app.use('/api/ai', aiLimiter)

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/submissions', submissionRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/mistakes', mistakeRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/knowledge', knowledgeRoutes)

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

// 全局错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)

  // 安全：生产环境不暴露详细错误
  const isDev = process.env.NODE_ENV !== 'production'
  const message = err?.message || '服务器内部错误'

  if (err?.status === 429 || err?.message?.includes('Too many requests')) {
    res.status(429).json({ error: '请求过于频繁，请稍后再试' })
    return
  }

  res.status(err?.status || 500).json({
    error: '服务器内部错误',
    ...(isDev ? { detail: message } : {}),
  })
})

app.listen(PORT, () => {
  console.log(`🚀 DKL Server running on http://localhost:${PORT}`)
  console.log(`   CORS Origins: ${allowedOrigins.join(', ')}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
})
