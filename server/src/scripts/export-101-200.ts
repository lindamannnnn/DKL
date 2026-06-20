import fs from 'fs'
import path from 'path'

const PROBLEMS_DIR = path.join(__dirname, '../../../hydroj/东方博宜OJ-1042题')

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

function normalizeTitle(title: string): string {
  return title
    .replace(/^['"](.*)['"]$/s, '$1')
    .replace(/^【.+?】/, '')
    .trim()
}

const dirs = fs.readdirSync(PROBLEMS_DIR)
  .filter(d => /^\d+$/.test(d))
  .map(d => parseInt(d))
  .sort((a, b) => a - b)
  .filter(d => d >= 101 && d <= 200)

const rows: { idx: number; title: string; prefix: string; tags: string[]; desc: string }[] = []

for (const num of dirs) {
  const dirPath = path.join(PROBLEMS_DIR, String(num))
  const yamlRaw = fs.readFileSync(path.join(dirPath, 'problem.yaml'), 'utf-8')
  const meta = simpleYamlParse(yamlRaw)
  const rawTitle = meta.title || ''
  const prefixMatch = rawTitle.match(/^【(.+?)】/)
  const prefix = prefixMatch ? prefixMatch[1] : ''
  const title = normalizeTitle(rawTitle)
  const tags = (meta.tag || []).map((t: string) => t.trim())

  const mdRaw = fs.readFileSync(path.join(dirPath, 'problem.md'), 'utf-8')
  const descMatch = mdRaw.match(/## Description\s*\n([\s\S]*?)(?=\n## |\n*$)/)
  let desc = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : ''
  if (desc.length > 200) desc = desc.slice(0, 200) + '...'

  rows.push({ idx: num, title, prefix, tags, desc })
}

console.log('# 东方博宜 OJ 第 101~200 题分类（待审核，按 DKL CSP 阶段 + 数据范围）\n')
console.log('| 编号 | 题目 | 原前缀 | 原标签 | 题面描述 | 建议标签 | 建议等级 |')
console.log('| --- | --- | --- | --- | --- | --- | --- |')
for (const r of rows) {
  console.log(`| ${r.idx} | ${r.title} | ${r.prefix} | ${r.tags.join(', ')} | ${r.desc} | | |`)
}
