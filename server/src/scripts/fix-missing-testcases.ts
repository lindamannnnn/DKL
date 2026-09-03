/**
 * 补齐缺失的测试点
 *
 * 依据 docs/reports/测试数据-真缺失明细.csv（由 verify-testdata-content.py 生成，
 * 已用内容指纹排除「同名不同题」误报），把源文件里有、但库里没有的测试点补进去。
 *
 * 安全策略：
 * - 只新增，绝不修改/删除现有测试点
 * - 按内容指纹(md5)去重，重复运行不会插重
 * - 新增的一律 isHidden=true（与既有补充测试点风格一致），sortOrder 从当前最大值继续
 *
 * 用法：tsx src/scripts/fix-missing-testcases.ts [dry]
 */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DRY = process.argv.includes('dry')
const ROOT = path.join(__dirname, '../../..')
const CSV = path.join(ROOT, 'docs/reports/测试数据-真缺失明细.csv')

/** 归一化：\r\n -> \n，去掉尾部换行，剔除 NUL 字节（UTF-16 转码残留，PG UTF8 不允许存储） */
function norm(s: string): string {
  return s.replace(/\x00/g, '').replace(/\r\n/g, '\n').replace(/\n+$/, '')
}
function fp(s: string): string {
  return crypto.createHash('md5').update(norm(s), 'utf-8').digest('hex')
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/^\uFEFF/, '').split('\n').filter(l => l.trim())
  const head = lines[0].split(',')
  return lines.slice(1).map(line => {
    // 简单 CSV：字段内无逗号（源目录含反斜杠但不含逗号）
    const cells = line.split(',')
    const obj: Record<string, string> = {}
    head.forEach((h, i) => (obj[h] = (cells[i] || '').trim()))
    return obj
  })
}

function readSourceCases(dir: string): { input: string; output: string }[] {
  const testdata = path.join(dir, 'testdata')
  if (!fs.existsSync(testdata)) return []
  const ins = fs.readdirSync(testdata)
    .filter(f => f.endsWith('.in'))
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
  const cases: { input: string; output: string }[] = []
  for (const f of ins) {
    const base = f.slice(0, -3)
    const outPath = path.join(testdata, base + '.out')
    const ansPath = path.join(testdata, base + '.ans')
    const op = fs.existsSync(outPath) ? outPath : fs.existsSync(ansPath) ? ansPath : null
    if (!op) continue
    cases.push({
      input: fs.readFileSync(path.join(testdata, f), 'utf-8'),
      output: fs.readFileSync(op, 'utf-8'),
    })
  }
  return cases
}

async function main() {
  if (!fs.existsSync(CSV)) {
    console.error(`找不到清单: ${CSV}`)
    process.exit(1)
  }
  const rows = parseCsv(fs.readFileSync(CSV, 'utf-8'))
  console.log(`清单共 ${rows.length} 题（dry=${DRY}）`)

  let added = 0
  for (const r of rows) {
    const pid = r['题目ID']
    const rel = r['源目录']
    const base = path.join(ROOT, 'hydroj', rel)
    const srcCases = readSourceCases(base)
    if (!srcCases.length) {
      console.warn(`⚠️  ${r['标题']} 源目录无测试数据：${rel}`)
      continue
    }

    const existing = await prisma.testCase.findMany({ where: { problemId: pid } })
    const have = new Set(existing.map(tc => fp(tc.input)))
    let maxOrder = existing.reduce((m, tc) => Math.max(m, tc.sortOrder), 0)

    const missing = srcCases.filter(c => !have.has(fp(c.input)))
    if (!missing.length) {
      console.log(`= ${r['标题']}：无需补充`)
      continue
    }

    if (!DRY) {
      for (const c of missing) {
        await prisma.testCase.create({
          data: {
            problemId: pid,
            input: norm(c.input),
            expectedOutput: norm(c.output),
            isHidden: true,
            score: 0,
            sortOrder: ++maxOrder,
          },
        })
      }
    }
    added += missing.length
    console.log(`+ ${r['标题']}：补 ${missing.length} 个测试点（源 ${srcCases.length} / 原有 ${existing.length}）`)
  }

  console.log(`\n完成：共补 ${added} 个测试点${DRY ? '（dry run，未写库）' : ''}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
