import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'

const PROBLEMS_DIR = path.join(__dirname, '../../../hydroj/东方博宜OJ-1042题')

// 简单 YAML 解析器（与导入脚本保持一致）
function simpleYamlParse(text: string): any {
  const lines = text.split('\n')
  const result: any = {}
  const stack: any[] = [result]
  let currentKey = ''
  let currentIndent = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) continue

    const indent = line.length - line.trimStart().length
    const trimmed = line.trim()

    if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.slice(0, colonIndex).trim()
      let value: any = trimmed.slice(colonIndex + 1).trim()

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      while (stack.length > 1 && indent <= currentIndent) {
        stack.pop()
      }

      const parent = stack[stack.length - 1]

      if (value === '') {
        const nextLine = lines[i + 1]
        if (nextLine && nextLine.trim().startsWith('- ')) {
          parent[key] = []
          stack.push(parent[key])
        } else {
          parent[key] = {}
          stack.push(parent[key])
        }
      } else {
        parent[key] = value
      }

      currentKey = key
      currentIndent = indent
    } else if (trimmed.startsWith('- ')) {
      let value: any = trimmed.slice(2).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      const parent = stack[stack.length - 1]
      if (Array.isArray(parent)) {
        if (value.includes(':')) {
          const obj: any = {}
          const colonIndex = value.indexOf(':')
          obj[value.slice(0, colonIndex).trim()] = value.slice(colonIndex + 1).trim()
          parent.push(obj)
          stack.push(obj)
          currentIndent = indent
        } else {
          parent.push(value)
        }
      }
    }
  }

  return result
}

const tagToLevel: Record<string, number> = {
  // GESP 8级
  '并查集': 8,
  // GESP 7级
  '图论': 7,
  '哈希': 7,
  '前缀和差分': 7,
  // GESP 6级
  '动态规划': 6,
  '深搜': 6,
  '广搜': 6,
  '回溯': 6,
  '背包问题': 6,
  '背包': 6,
  '队列': 6,
  '容器': 6,
  // GESP 5级
  '递归': 5,
  '贪心': 5,
  '二分': 5,
  '分治': 5,
  '高精度算法': 5,
  '埃筛': 5,
  // GESP 4级
  '二维数组': 4,
  '函数': 4,
  '函数问题': 4,
  '结构体': 4,
  '递推': 4,
  // GESP 3级
  '数组问题': 3,
  '数组': 3,
  '字符串': 3,
  '进制转换': 3,
  '模拟': 3,
  // GESP 1级
  '基础问题': 1,
  '字符型': 1,

  // GESP 2级
  '分支问题': 2,
  '循环': 2,
}

function computeLevel(tags: string[]): number {
  let level = 0
  for (const tag of tags) {
    const lvl = tagToLevel[tag]
    if (lvl && lvl > level) level = lvl
  }
  return level || 1
}

function normalizeTitle(title: string): string {
  // 去掉 YAML 值的引号、前后空格、以及前缀等级
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

  // 加载所有题目（东方博宜题目通过 title 匹配）
  const dbProblems = await prisma.problem.findMany({
    select: { id: true, title: true, gespLevel: true },
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

      const meta = simpleYamlParse(yamlRaw)
      const tags: string[] = (meta.tag || []).map((t: string) => t.trim())

      const newLevel = computeLevel(tags)

      for (const id of ids) {
        await prisma.problem.update({
          where: { id },
          data: {
            gespLevel: newLevel,
            tags: tags.join(','),
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

  console.log(`\n🎉 级别修复完成：更新 ${updated} 道，跳过 ${skipped} 道，失败 ${failed} 道`)
}

main()
  .catch(e => {
    console.error('修复失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
