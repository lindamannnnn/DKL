import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown, parseLessonPages } from '../parsers/markdownParser'

/**
 * GESP3 课件批量自检脚本
 * 运行：npx tsx src/scripts/check-gesp3-lessons.ts [文件名过滤]
 */

const COURSES_DIR = path.join(__dirname, '../../courses/gesp3')
const INTERACTIVE = new Set(['card', 'demo', 'checkpoint', 'story', 'problem', 'quiz'])
const CROSS_PAGE_RE = /上面的代码|上面的|刚才的|上一页|前文的|下图|上文/

async function main() {
  const filter = process.argv[2]
  const files = fs
    .readdirSync(COURSES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('README') && !f.startsWith('problem'))
    .filter((f) => !filter || f.includes(filter))
    .sort()

  let totalIssues = 0

  for (const file of files) {
    const raw = fs.readFileSync(path.join(COURSES_DIR, file), 'utf-8')
    const issues: string[] = []

    // 1) 解析
    let content: any[] = []
    let pages: any[] = []
    try {
      content = parseLessonMarkdown(raw) as any[]
      pages = parseLessonPages(raw) as any[]
    } catch (e: any) {
      console.log(`\n❌ ${file}: 解析失败 ${e.message}`)
      totalIssues++
      continue
    }

    // 2) 每页必须有互动块
    pages.forEach((p: any, i: number) => {
      const has = p.blocks.some((b: any) => INTERACTIVE.has(b.type))
      if (!has) issues.push(`第 ${i + 1} 页（${p.title}）没有互动块`)
    })

    // 3) 块数量
    const cps = content.filter((b) => b.type === 'checkpoint')
    const probs = content.filter((b) => b.type === 'problem')
    if (cps.length < 3 && !file.includes('真题')) issues.push(`checkpoint 只有 ${cps.length} 个（<3）`)
    if (probs.length !== 5) issues.push(`课后题 ${probs.length} 道（应为 5）`)

    // 4) 代码块行数
    const codeBlocks = raw.match(/```cpp[\s\S]*?```/g) || []
    codeBlocks.forEach((c, i) => {
      const lines = c.split('\n').length - 2
      if (lines > 13) issues.push(`代码块${i + 1} 有 ${lines} 行（>13）`)
    })

    // 5) 标题长度
    const titles = raw.match(/^## .+$/gm) || []
    titles.forEach((t) => {
      const name = t.replace(/^## /, '')
      if (name.length > 13) issues.push(`长标题（${name.length}字）: ${name}`)
    })

    // 6) 跨页引用
    const lines = raw.split('\n')
    lines.forEach((l, i) => {
      if (CROSS_PAGE_RE.test(l)) issues.push(`第 ${i + 1} 行疑似跨页引用: ${l.trim().slice(0, 40)}`)
    })

    // 7) quiz 题干必须一行
    for (const b of content) {
      if (b.type === 'quiz' && b.metadata?.type === 'choice') {
        const qlines = (b.content as string).split('\n').filter((l: string) => l.trim())
        const nonOption = qlines.filter((l: string) => !/^[A-D][.．]/.test(l.trim()))
        if (nonOption.length > 1) issues.push(`quiz 题干 ${nonOption.length} 行（应为 1 行）: ${nonOption[0].slice(0, 30)}...`)
      }
    }

    // 8) problem ID 存在性
    for (const b of probs) {
      const id = (b.metadata?.problemId || '').trim()
      if (!id) {
        issues.push('problem 块缺少 ID')
        continue
      }
      const p = await prisma.problem.findUnique({
        where: { id },
        select: { title: true, _count: { select: { testCases: true } } },
      })
      if (!p) issues.push(`problem ID 不存在: ${id}`)
      else if (p._count.testCases === 0) issues.push(`problem「${p.title}」没有测试用例`)
    }

    const status = issues.length === 0 ? '✅' : '⚠️'
    console.log(`\n${status} ${file}: ${pages.length} 页, checkpoint=${cps.length}, problem=${probs.length}`)
    issues.forEach((i) => console.log(`   - ${i}`))
    totalIssues += issues.length
  }

  console.log(`\n${totalIssues === 0 ? '🎉 全部通过' : `共 ${totalIssues} 个问题`}`)
  process.exit(totalIssues === 0 ? 0 : 1)
}

main()
  .catch((e) => {
    console.error('自检失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
