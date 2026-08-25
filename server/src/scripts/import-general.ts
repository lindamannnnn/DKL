import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { prisma } from '../utils/prisma'

/**
 * 通用题库导入器
 * 扫描 hydroj 下多个题包，把"≥5 测试点且标题未在库"的题导入 Problem/TestCase。
 * 兼容三套目录结构：
 *   - 东方博宜: problem.yaml + problem.md + testdata/*.in.out
 *   - hydro(一本通/csptm): problem.yaml + (problem.md | problem_zh.md) + testdata/*.in.out
 *   - 炼石noip: problem.yaml + problem_zh.md + testdata/*.in.out
 * 用法：tsx src/scripts/import-general.ts [dry]   dry=只统计不写库
 */

const HYDROJ = path.join(__dirname, '../../../hydroj')
const DRY = process.argv.includes('dry')
const MIN_TESTPOINTS = 5

// 只导这些包（东方博宜已在库，跳过）
const PACKS = ['hydro', '炼石noip']

// 简单 YAML 解析（够用：pid/title/tag/owner）
function simpleYamlParse(text: string): any {
  const lines = text.split('\n')
  const result: any = {}
  const stack: any[] = [result]
  let currentIndent = 0
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const indent = line.length - line.trimStart().length
    const trimmed = line.trim()
    if (trimmed.includes(':')) {
      const ci = trimmed.indexOf(':')
      const key = trimmed.slice(0, ci).trim()
      let value: any = trimmed.slice(ci + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
      while (stack.length > 1 && indent <= currentIndent) stack.pop()
      const parent = stack[stack.length - 1]
      if (value === '') {
        const next = lines[lines.indexOf(line) + 1]
        if (next && next.trim().startsWith('- ')) { parent[key] = []; stack.push(parent[key]) }
        else { parent[key] = {}; stack.push(parent[key]) }
      } else parent[key] = value
      currentIndent = indent
    } else if (trimmed.startsWith('- ')) {
      let v: any = trimmed.slice(2).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      const parent = stack[stack.length - 1]
      if (Array.isArray(parent)) parent.push(v)
    }
  }
  return result
}

function hasStmt(d: string): boolean {
  return ['problem.yaml'].some(f => fs.existsSync(path.join(d, f)))
}
function countIn(d: string): number {
  const td = path.join(d, 'testdata')
  if (!fs.existsSync(td)) return 0
  return fs.readdirSync(td).filter(f => f.endsWith('.in')).length
}
// 读取题面 markdown：优先 problem.md（非空）→ problem_zh.md（非空）
function readMd(dir: string): string {
  for (const f of ['problem.md', 'problem_zh.md']) {
    const fp = path.join(dir, f)
    if (fs.existsSync(fp)) {
      const t = fs.readFileSync(fp, 'utf-8').trim()
      if (t.length > 10) return t
    }
  }
  return ''
}
function getTitle(dir: string, meta: any): string {
  return (meta.title || path.basename(dir)).replace(/^【.+?】/, '').trim()
}
function norm(s: string): string {
  return s.replace(/【.*?】/g, '').replace(/[\s　_]+/g, '').replace(/[()（）\-—]/g, '').toLowerCase()
}

// 从 md 提取首个样例输入输出
function extractSample(md: string): { input: string; output: string } {
  const grab = (re: RegExp) => { const m = md.match(re); return m ? m[1].trim() : '' }
  let input = grab(/```input1\n([\s\S]*?)```/) || grab(/```input\n([\s\S]*?)```/)
  let output = grab(/```output1\n([\s\S]*?)```/) || grab(/```output\n([\s\S]*?)```/)
  return { input, output }
}

function parseLimit(v: any, def: number): number {
  if (v === undefined) return def
  if (typeof v === 'number') return v
  const m = String(v).match(/^\d+/)
  return m ? parseInt(m[0], 10) : def
}

interface Found { dir: string; pack: string; meta: any; title: string; md: string; nIn: number }

function scan(): Found[] {
  const out: Found[] = []
  for (const pack of PACKS) {
    const root = path.join(HYDROJ, pack)
    if (!fs.existsSync(root)) continue
    const walk = (dir: string) => {
      let ents: string[] = []
      try { ents = fs.readdirSync(dir) } catch { return }
      if (hasStmt(dir)) {
        const nIn = countIn(dir)
        if (nIn >= MIN_TESTPOINTS) {
          try {
            const meta = simpleYamlParse(fs.readFileSync(path.join(dir, 'problem.yaml'), 'utf-8'))
            const md = readMd(dir)
            const title = getTitle(dir, meta)
            if (title && md) out.push({ dir, pack, meta, title, md, nIn })
          } catch {}
        }
        return
      }
      for (const e of ents) {
        const fp = path.join(dir, e)
        try { if (fs.statSync(fp).isDirectory()) walk(fp) } catch {}
      }
    }
    walk(root)
  }
  return out
}

// GESP 级别映射（沿用东方博宜导入器的 tag→level）
const TAG_TO_LEVEL: Record<string, number> = {
  '并查集': 8, '图论': 7, '哈希': 7, '前缀和差分': 7,
  '动态规划': 6, '深搜': 6, '广搜': 6, '回溯': 6, '背包问题': 6, '背包': 6, '队列': 6, '容器': 6,
  '递归': 5, '贪心': 5, '二分': 5, '分治': 5, '高精度算法': 5, '埃筛': 5,
  '二维数组': 4, '函数': 4, '函数问题': 4, '结构体': 4, '递推': 4,
  '数组问题': 3, '数组': 3, '字符串': 3, '进制转换': 3, '模拟': 3,
  '分支问题': 2, '循环': 2, '基础问题': 1, '字符型': 1,
}

async function main() {
  const tenantId = process.env.DEFAULT_TENANT_ID || '080ffa34-df87-4566-b1ef-555b88bfe5b8'
  console.log(DRY ? '🔎 DRY 模式：只统计不写库' : '🚀 正式导入模式')

  // DB 现有标题（规范化）用于去重
  const dbTitles = await prisma.problem.findMany({ select: { title: true } })
  const dbSet = new Set(dbTitles.map(t => norm(t.title)))
  console.log(`DB 现有题数：${dbSet.size}`)

  const found = scan()
  console.log(`扫描到 ≥${MIN_TESTPOINTS} 测试点的题：${found.length} 道`)

  const todo = found.filter(f => !dbSet.has(norm(f.title)))
  console.log(`其中未入库（标题不匹配）：${todo.length} 道\n`)

  if (DRY) {
    const byPack: Record<string, number> = {}
    todo.forEach(t => byPack[t.pack] = (byPack[t.pack] || 0) + 1)
    console.log('按包分布:', byPack)
    await prisma.$disconnect()
    return
  }

  let success = 0, failed = 0, skipped = 0
  for (let i = 0; i < todo.length; i++) {
    const f = todo[i]
    try {
      const testdataDir = path.join(f.dir, 'testdata')
      const files = fs.readdirSync(testdataDir).sort()
      const inFiles = files.filter(x => x.endsWith('.in')).sort()
      const testCases: { input: string; expectedOutput: string }[] = []
      for (const inFile of inFiles) {
        const base = inFile.slice(0, -3)
        const outFile = base + '.out'
        const ansFile = base + '.ans'
        const ip = path.join(testdataDir, inFile)
        let ep: string | null = null
        if (fs.existsSync(path.join(testdataDir, outFile))) ep = path.join(testdataDir, outFile)
        else if (fs.existsSync(path.join(testdataDir, ansFile))) ep = path.join(testdataDir, ansFile)
        if (ep) testCases.push({ input: fs.readFileSync(ip, 'utf-8'), expectedOutput: fs.readFileSync(ep, 'utf-8') })
      }
      if (testCases.length < MIN_TESTPOINTS) { skipped++; continue }

      const descriptionHtml = await marked.parse(f.md)
      const sample = extractSample(f.md)
      let sampleInput = sample.input, sampleOutput = sample.output
      if ((!sampleInput || !sampleOutput) && testCases.length > 0) {
        if (!sampleInput) sampleInput = testCases[0].input.trim()
        if (!sampleOutput) sampleOutput = testCases[0].expectedOutput.trim()
      }

      // 时间/内存限制
      let timeLimit = 1000, memoryLimit = 128
      const cfgPath = path.join(testdataDir, 'config.yaml')
      if (fs.existsSync(cfgPath)) {
        const cfg = simpleYamlParse(fs.readFileSync(cfgPath, 'utf-8'))
        timeLimit = parseLimit(cfg?.time, 1000)
        memoryLimit = parseLimit(cfg?.memory, 128)
      }

      // 标签与 GESP 级别
      let tags: string[] = []
      const rawTag = f.meta.tag
      if (Array.isArray(rawTag)) tags = rawTag
      else if (typeof rawTag === 'string' && rawTag.trim() && rawTag.trim() !== '[]') tags = rawTag.split(',').map(s => s.trim()).filter(Boolean)
      let gespLevel = 0
      for (const t of tags) { const lv = TAG_TO_LEVEL[t]; if (lv && lv > gespLevel) gespLevel = lv }
      // 难度：默认按测试点数+来源粗判
      const difficulty = f.pack === '炼石noip' ? 'hard' : (f.nIn >= 10 ? 'medium' : 'easy')

      const problem = await prisma.problem.create({
        data: {
          tenantId,
          title: f.title,
          description: descriptionHtml,
          inputDesc: '', outputDesc: '',
          sampleInput, sampleOutput, sampleExplanation: '',
          starterCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`,
          difficulty,
          tags: tags.join(','),
          gespLevel: gespLevel || null,
          timeLimit, memoryLimit,
          status: 'active',
        },
      })

      const perScore = Math.floor(100 / testCases.length)
      for (let j = 0; j < testCases.length; j++) {
        await prisma.testCase.create({
          data: {
            problemId: problem.id,
            input: testCases[j].input,
            expectedOutput: testCases[j].expectedOutput,
            isHidden: j > 0,
            score: j === testCases.length - 1 ? 100 - perScore * (testCases.length - 1) : perScore,
            sortOrder: j + 1,
          },
        })
      }
      success++
      if ((i + 1) % 25 === 0 || i === todo.length - 1) console.log(`✅ 进度 ${i + 1}/${todo.length}  当前: ${f.title} (${testCases.length}点)`)
    } catch (err: any) {
      failed++
      console.error(`❌ [${i + 1}/${todo.length}] ${f.title} 失败: ${err.message}`)
    }
  }

  console.log(`\n🎉 完成：成功 ${success}，失败 ${failed}，跳过(<${MIN_TESTPOINTS}点) ${skipped}`)
  await prisma.$disconnect()
}

main().catch(e => { console.error('导入失败:', e); process.exit(1) })
