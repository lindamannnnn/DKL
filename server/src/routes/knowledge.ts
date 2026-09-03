/**
 * GESP 知识快查 - RAG 路由
 *
 * POST /api/knowledge/search  混合检索（向量+关键词），返回 topK 块及来源
 * POST /api/knowledge/ask     检索 + LLM 生成回答（带引用）
 * GET  /api/knowledge/stats   语料统计（展示用）
 */
import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'
import { hybridSearch, answer } from '../services/knowledgeService'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

// 检索（无需 LLM，embeddings key 缺失时自动退化为关键词检索）
router.post('/search', async (req, res) => {
  try {
    const { query, level, type, topK } = req.body || {}
    if (!query || !String(query).trim()) {
      return res.status(400).json({ error: 'query 不能为空' })
    }
    const { items, usedKeywords } = await hybridSearch(String(query).trim().slice(0, 200), {
      topK: Math.min(Number(topK) || 8, 20),
      level: level || undefined,
      type: type || undefined,
    })
    res.json({ items, usedKeywords })
  } catch (e: any) {
    console.error('[knowledge/search]', e)
    res.status(500).json({ error: e.message || '检索失败' })
  }
})

// RAG 问答（检索 + LLM）
router.post('/ask', async (req, res) => {
  try {
    const { query, level } = req.body || {}
    if (!query || !String(query).trim()) {
      return res.status(400).json({ error: 'query 不能为空' })
    }
    const result = await answer(String(query).trim().slice(0, 300), { level: level || undefined })
    res.json(result)
  } catch (e: any) {
    console.error('[knowledge/ask]', e)
    res.status(500).json({ error: e.message || '问答失败' })
  }
})

// 语料统计
router.get('/stats', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe(`
      SELECT level, type, count(*) AS n FROM knowledge_chunks
      WHERE tenant_id = 'default' GROUP BY level, type ORDER BY level::int
    `) as any[]
    const byLevel = rows.map((r: any) => ({
      level: String(r.level),
      type: String(r.type),
      n: Number(r.n),
    }))
    const total = byLevel.reduce((s: number, r) => s + r.n, 0)
    res.json({ total, byLevel })
  } catch (e: any) {
    console.error('[knowledge/stats]', e)
    res.status(500).json({ error: e.message || '统计失败' })
  }
})

export default router
