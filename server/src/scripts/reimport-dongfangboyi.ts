import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { prisma } from '../utils/prisma'

// 简单 YAML 解析器，只处理本题库需要的格式
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

// 读取总表中的分类映射
function loadAuditMap(auditPath: string): Map<number, { tags: string; gespLevel: number }> {
  const map = new Map<number, { tags: string; gespLevel: number }>()
  const lines = fs.readFileSync(auditPath, 'utf-8').split('\n')

  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue
    const parts = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(s => s.trim())
    if (parts.length < 4 || !/^\d+$/.test(parts[0])) continue

    const id = parseInt(parts[0], 10)
    let tag: string
    let levelStr: string

    if (parts.length === 4) {
      // 前100题格式: | id | title | tag | level |
      tag = parts[2]
      levelStr = parts[3]
    } else {
      // 后段格式: | id | title | diff | orig_tag | desc | sug_tag | sug_level |
      tag = parts[5]
      levelStr = parts[6]
    }

    const levelMatch = levelStr.match(/CSP0?(\d)/)
    if (!levelMatch) continue

    map.set(id, {
      tags: tag,
      gespLevel: parseInt(levelMatch[1], 10),
    })
  }

  return map
}

const PROBLEMS_DIR = path.join(__dirname, '../../../hydroj/东方博宜OJ-1042题')
const AUDIT_PATH = path.join(__dirname, '../../../docs/东方博宜1-1042题分类_总表.md')

function parseLimit(value: string | number | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue
  if (typeof value === 'number') return value
  const match = String(value).match(/^\d+/)
  return match ? parseInt(match[0], 10) : defaultValue
}

function extractFirstCodeBlock(md: string): string {
  const match = md.match(/```[\s\S]*?\n([\s\S]*?)```/)
  return match ? match[1].trim() : ''
}

// 拆分题面中的 Description / Input Format / Output Format / Hint / Source
function parseProblemMarkdown(md: string): {
  description: string
  inputDesc: string
  outputDesc: string
  hint: string
  source: string
} {
  const result = {
    description: '',
    inputDesc: '',
    outputDesc: '',
    hint: '',
    source: '',
  }
  const regex = /^##\s+(Description|Input Format|Output Format|Hint|Source)\s*$/gim
  const matches: { title: string; index: number; length: number }[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(md)) !== null) {
    matches.push({ title: match[1], index: match.index, length: match[0].length })
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].length
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length
    const content = md.slice(start, end).trim()
    switch (matches[i].title) {
      case 'Description':
        result.description = content
        break
      case 'Input Format':
        result.inputDesc = content
        break
      case 'Output Format':
        result.outputDesc = content
        break
      case 'Hint':
        result.hint = content
        break
      case 'Source':
        result.source = content
        break
    }
  }
  // 输入输出说明里不再保留样例代码块，避免与 sampleInput/sampleOutput 重复展示
  result.inputDesc = result.inputDesc.replace(/```(?:input1?|output1?)\n[\s\S]*?```/g, '').trim()
  result.outputDesc = result.outputDesc.replace(/```(?:input1?|output1?)\n[\s\S]*?```/g, '').trim()
  return result
}

function extractSampleFromMarkdown(md: string): { input: string; output: string } {
  let input = ''
  let output = ''

  const inputMatch = md.match(/```input1\n([\s\S]*?)```/)
  if (inputMatch) input = inputMatch[1].trim()

  const outputMatch = md.match(/```output1\n([\s\S]*?)```/)
  if (outputMatch) output = outputMatch[1].trim()

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

async function main() {
  if (!fs.existsSync(PROBLEMS_DIR)) {
    console.error('❌ 东方博宜题库目录不存在:', PROBLEMS_DIR)
    process.exit(1)
  }

  if (!fs.existsSync(AUDIT_PATH)) {
    console.error('❌ 分类总表不存在:', AUDIT_PATH)
    process.exit(1)
  }

  const auditMap = loadAuditMap(AUDIT_PATH)
  console.log(`📋 从总表读取到 ${auditMap.size} 道题的分类`)

  const dirs = fs.readdirSync(PROBLEMS_DIR)
    .filter(d => {
      const full = path.join(PROBLEMS_DIR, d)
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'problem.yaml'))
    })
    .sort((a, b) => parseInt(a) - parseInt(b))

  console.log(`📚 发现 ${dirs.length} 道题目，开始导入...`)

  const tenantId = process.env.DEFAULT_TENANT_ID || '080ffa34-df87-4566-b1ef-555b88bfe5b8'
  let success = 0
  let failed = 0
  let missingAudit = 0

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]
    const dirPath = path.join(PROBLEMS_DIR, dir)
    const problemId = parseInt(dir, 10)

    try {
      const audit = auditMap.get(problemId)
      if (!audit) {
        missingAudit++
        console.warn(`⚠️ [${i + 1}/${dirs.length}] 题目 ${dir} 在总表中无分类，跳过`)
        continue
      }

      const yamlRaw = fs.readFileSync(path.join(dirPath, 'problem.yaml'), 'utf-8')
      const meta = simpleYamlParse(yamlRaw)

      const mdRaw = fs.readFileSync(path.join(dirPath, 'problem.md'), 'utf-8')
      const sections = parseProblemMarkdown(mdRaw)

      // 渲染题面描述（包含提示和来源）
      let descriptionHtml = `<!-- dongfangboyi-id: ${problemId} -->\n${await marked.parse(sections.description || '')}`
      const extras: string[] = []
      if (sections.hint) extras.push(`## 提示\n\n${sections.hint}`)
      if (sections.source) extras.push(`## 来源\n\n${sections.source}`)
      if (extras.length > 0) {
        descriptionHtml += '\n' + (await marked.parse(extras.join('\n\n')))
      }

      const title = meta.title || ''
      const levelPrefix = title.match(/【(.+?)】/)?.[1] || '入门'
      const difficultyMap: Record<string, string> = {
        '入门': 'easy',
        '基础': 'medium',
        '提高': 'hard',
      }
      const difficulty = difficultyMap[levelPrefix] || 'easy'

      const mdSample = extractSampleFromMarkdown(mdRaw)
      let sampleInput = mdSample.input
      let sampleOutput = mdSample.output

      const testdataDir = path.join(dirPath, 'testdata')
      if ((!sampleInput || !sampleOutput) && fs.existsSync(testdataDir)) {
        const files = fs.readdirSync(testdataDir).sort()
        const inFiles = files.filter(f => f.endsWith('.in'))
        if (inFiles.length > 0 && !sampleInput) {
          sampleInput = fs.readFileSync(path.join(testdataDir, inFiles[0]), 'utf-8').trim()
        }
        const outFiles = files.filter(f => f.endsWith('.out'))
        if (outFiles.length > 0 && !sampleOutput) {
          sampleOutput = fs.readFileSync(path.join(testdataDir, outFiles[0]), 'utf-8').trim()
        }
      }

      let timeLimit = 1000
      let memoryLimit = 128
      const configPath = path.join(testdataDir, 'config.yaml')
      if (fs.existsSync(configPath)) {
        const configRaw = fs.readFileSync(configPath, 'utf-8')
        const config = simpleYamlParse(configRaw)
        timeLimit = parseLimit(config?.time, 1000)
        memoryLimit = parseLimit(config?.memory, 128)
      }

      const testCases: { input: string; expectedOutput: string }[] = []
      if (fs.existsSync(testdataDir)) {
        const files = fs.readdirSync(testdataDir).sort()
        const inFiles = files.filter(f => f.endsWith('.in')).sort()
        for (const inFile of inFiles) {
          const baseName = inFile.slice(0, -3)
          const outFile = baseName + '.out'
          const inPath = path.join(testdataDir, inFile)
          const outPath = path.join(testdataDir, outFile)
          if (fs.existsSync(outPath)) {
            testCases.push({
              input: fs.readFileSync(inPath, 'utf-8'),
              expectedOutput: fs.readFileSync(outPath, 'utf-8'),
            })
          }
        }
      }

      if (testCases.length === 0) {
        throw new Error('没有测试数据')
      }

      const problem = await prisma.problem.create({
        data: {
          tenantId,
          title: title.replace(/^【.+?】/, '').trim() || title,
          description: descriptionHtml,
          inputDesc: sections.inputDesc ? await marked.parse(sections.inputDesc) : '',
          outputDesc: sections.outputDesc ? await marked.parse(sections.outputDesc) : '',
          sampleInput,
          sampleOutput,
          sampleExplanation: '',
          starterCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`,
          difficulty,
          tags: audit.tags,
          gespLevel: audit.gespLevel,
          timeLimit,
          memoryLimit,
          status: 'active',
        },
      })

      const perScore = Math.floor(100 / testCases.length)

      for (let j = 0; j < testCases.length; j++) {
        const tc = testCases[j]
        await prisma.testCase.create({
          data: {
            problemId: problem.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: j > 0,
            score: j === testCases.length - 1 ? 100 - perScore * (testCases.length - 1) : perScore,
            sortOrder: j + 1,
          },
        })
      }

      success++
      console.log(`✅ [${i + 1}/${dirs.length}] ${problem.title} → CSP0${audit.gespLevel} (${testCases.length} 个测试点)`)
    } catch (err: any) {
      failed++
      console.error(`❌ [${i + 1}/${dirs.length}] 题目 ${dir} 导入失败:`, err.message)
    }
  }

  console.log(`\n🎉 导入完成：成功 ${success} 道，失败 ${failed} 道，总表缺失 ${missingAudit} 道`)
}

main()
  .catch(e => {
    console.error('导入失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
