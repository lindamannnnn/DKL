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
import { hybridSearch, answer, teach, streamTeach } from '../services/knowledgeService'

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

// 编程老师讲解（检索 + 老师人设 LLM，按固定结构重新讲知识点）
// body.stream=true 时走 SSE 流式（打字机展示，长输出不超时）；否则一次性 JSON
router.post('/teach', async (req, res) => {
  try {
    const { query, level, style, stream } = req.body || {}
    const q = String(query || '').trim()
    if (!q) {
      return res.status(400).json({ error: 'query 不能为空' })
    }
    const opts = {
      level: level || undefined,
      style: typeof style === 'string' ? style : undefined,
    }

    // ========== SSE 流式模式 ==========
    if (stream === true) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')
      res.flushHeaders()

      let full = ''
      const send = (type: string, data: unknown) => {
        res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`)
      }

      try {
        const result = await streamTeach(q.slice(0, 300), opts, (delta) => {
          full += delta
          send('delta', { text: delta })
        })
        // 流结束后按后端逻辑清洗并附真实来源（与同步版一致）
        const cleaned = full
          .replace(/\[来源[^\]]*\]/g, '')
          .replace(/\[资料[^\]]*\]/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
        const noHit = /没找到|没有找到|超出范围|无法回答|资料里没有/.test(cleaned)
        const finalText =
          noHit || !result.sources.length ? cleaned : `${cleaned}\n\n---\n讲解参考来源：\n${result.sources
            .map((c, i) => `${i + 1}. 《${c.title}》${c.heading ? ` · ${c.heading}` : ''}${c.level ? ` (GESP${c.level}级)` : ''}`)
            .join('\n')}`
        send('done', { text: finalText, sources: result.sources, gate: result.gate })
      } catch (e: any) {
        console.error('[knowledge/teach-stream]', e)
        if (!res.writableEnded) {
          send('error', { message: e.message || '讲解失败' })
        }
      } finally {
        res.end()
      }
      return
    }

    // ========== 同步 JSON 模式 ==========
    const result = await teach(q.slice(0, 300), opts)
    res.json(result)
  } catch (e: any) {
    console.error('[knowledge/teach]', e)
    res.status(500).json({ error: e.message || '讲解失败' })
  }
})

// 语料统计
router.get('/stats', async (_req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe(`
      SELECT level, type, count(*) AS n FROM knowledge_chunks
      WHERE tenant_id = 'default' GROUP BY level, type
      ORDER BY (CASE WHEN level = '' THEN 99 ELSE level::int END), type
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
