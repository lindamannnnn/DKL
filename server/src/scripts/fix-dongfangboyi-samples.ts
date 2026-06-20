import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'

const PROBLEMS_DIR = path.join(__dirname, '../../../hydroj/东方博宜OJ-1042题')

// 从 markdown 文本中提取 input1/output1 代码块
function extractSampleFromMarkdown(md: string): { input: string; output: string } {
  let input = ''
  let output = ''

  const inputMatch = md.match(/```input1\n([\s\S]*?)```/)
  if (inputMatch) input = inputMatch[1].trim()

  const outputMatch = md.match(/```output1\n([\s\S]*?)```/)
  if (outputMatch) output = outputMatch[1].trim()

  // 也支持 ```input / ```output 格式
  if (!input) {
    const altInput = md.match(/```input\n([\s\S]*?)```/)
    if (altInput) input = altInput[1].trim()
  }
  if (!output) {
    const altOutput = md.match(/```output\n([\s\S]*?)```/)
    if (altOutput) output = altOutput[1].trim()
  }

  return { input, output }
}

function normalizeTitle(title: string): string {
  return title
    .replace(/^['"](.*)['"]$/s, '$1')
    .replace(/^【.+?】/, '')
    .trim()
}

async function main() {
  if (!fs.existsSync(PROBLEMS_DIR)) {
    console.error('❌ 题库目录不存在:', PROBLEMS_DIR)
    process.exit(1)
  }

  // 加载所有东方博宜题目到内存
  const dbProblems = await prisma.problem.findMany({
    where: { tags: { contains: '东方博宜' } },
    select: { id: true, title: true },
  })

  const titleToIds = new Map<string, string[]>()
  for (const p of dbProblems) {
    const list = titleToIds.get(p.title) || []
    list.push(p.id)
    titleToIds.set(p.title, list)
  }

  const dirs = fs.readdirSync(PROBLEMS_DIR)
    .filter(d => {
      const full = path.join(PROBLEMS_DIR, d)
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'problem.yaml'))
    })
    .sort((a, b) => parseInt(a) - parseInt(b))

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const dir of dirs) {
    try {
      const dirPath = path.join(PROBLEMS_DIR, dir)
      const yamlRaw = fs.readFileSync(path.join(dirPath, 'problem.yaml'), 'utf-8')
      const titleMatch = yamlRaw.match(/^title:\s*(.+)$/m)
      if (!titleMatch) {
        skipped++
        continue
      }
      const rawTitle = titleMatch[1].trim()
      const title = normalizeTitle(rawTitle)

      const ids = titleToIds.get(title)
      if (!ids || ids.length === 0) {
        console.warn(`⚠️ 未找到对应题目: ${title}`)
        skipped++
        continue
      }

      const mdRaw = fs.readFileSync(path.join(dirPath, 'problem.md'), 'utf-8')
      const sample = extractSampleFromMarkdown(mdRaw)
      if (!sample.input && !sample.output) {
        skipped++
        continue
      }

      // 更新所有匹配 title 的题目（通常只有一个）
      for (const id of ids) {
        await prisma.problem.update({
          where: { id },
          data: {
            sampleInput: sample.input,
            sampleOutput: sample.output,
          },
        })
      }

      updated++
      if (updated % 100 === 0) {
        console.log(`🔄 已更新 ${updated} 道...`)
      }
    } catch (err: any) {
      failed++
      console.error(`❌ 目录 ${dir} 更新失败:`, err.message)
    }
  }

  console.log(`\n🎉 样例修复完成：更新 ${updated} 道，跳过 ${skipped} 道，失败 ${failed} 道`)
}

main()
  .catch(e => {
    console.error('修复失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
