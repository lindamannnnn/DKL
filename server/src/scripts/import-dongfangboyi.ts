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

    // 处理键值对
    if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.slice(0, colonIndex).trim()
      let value: any = trimmed.slice(colonIndex + 1).trim()

      // 去掉引号
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      // 根据缩进调整栈
      while (stack.length > 1 && indent <= currentIndent) {
        stack.pop()
      }

      const parent = stack[stack.length - 1]

      if (value === '') {
        // 可能是对象或数组，看下一行
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
      // 数组元素
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

// 东方博宜题库路径
const PROBLEMS_DIR = path.join(__dirname, '../../../hydroj/东方博宜OJ-1042题')

// 解析 config.yaml 中的时间/内存限制
function parseLimit(value: string | number | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue
  if (typeof value === 'number') return value
  // 去掉单位，如 "1000ms" -> 1000, "64m" -> 64
  const match = String(value).match(/^\d+/)
  return match ? parseInt(match[0], 10) : defaultValue
}

// 从 markdown 文本中提取第一个代码块作为样例
function extractFirstCodeBlock(md: string): string {
  const match = md.match(/```[\s\S]*?\n([\s\S]*?)```/)
  return match ? match[1].trim() : ''
}

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

async function main() {
  if (!fs.existsSync(PROBLEMS_DIR)) {
    console.error('❌ 东方博宜题库目录不存在:', PROBLEMS_DIR)
    process.exit(1)
  }

  // 读取所有题目目录
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

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]
    const dirPath = path.join(PROBLEMS_DIR, dir)

    try {
      // 读取元数据
      const yamlRaw = fs.readFileSync(path.join(dirPath, 'problem.yaml'), 'utf-8')
      const meta = simpleYamlParse(yamlRaw)

      // 读取题面
      const mdRaw = fs.readFileSync(path.join(dirPath, 'problem.md'), 'utf-8')
      const descriptionHtml = await marked.parse(mdRaw)

      // 解析难度
      const title = meta.title || ''
      const levelPrefix = title.match(/【(.+?)】/)?.[1] || '入门'
      const difficultyMap: Record<string, string> = {
        '入门': 'easy',
        '基础': 'medium',
        '提高': 'hard',
      }
      const difficulty = difficultyMap[levelPrefix] || 'easy'

      // gespLevel：根据 GESP 官方大纲，按标签对应级别取最高级
      const problemTags = (meta.tag || []) as string[]
      const tagToLevel: Record<string, number> = {
        // GESP 8级：组合数学、图论综合、复杂优化
        '并查集': 8,

        // GESP 7级：复杂 DP、图论基础、哈希表
        '图论': 7,
        '哈希': 7,
        '前缀和差分': 7,

        // GESP 6级：搜索、树、简单 DP、栈队列、容器
        '动态规划': 6,
        '深搜': 6,
        '广搜': 6,
        '回溯': 6,
        '背包问题': 6,
        '背包': 6,
        '队列': 6,
        '容器': 6,

        // GESP 5级：数论、分治贪心递归二分
        '递归': 5,
        '贪心': 5,
        '二分': 5,
        '分治': 5,
        '高精度算法': 5,
        '埃筛': 5,

        // GESP 4级：函数、结构体、二维数组、递推、排序
        '二维数组': 4,
        '函数': 4,
        '函数问题': 4,
        '结构体': 4,
        '递推': 4,

        // GESP 3级：一维数组、字符串、枚举模拟进制
        '数组问题': 3,
        '数组': 3,
        '字符串': 3,
        '进制转换': 3,
        '模拟': 3,

        // GESP 1级：基础语法
        '基础问题': 1,
        '字符型': 1,

        // GESP 2级：多层分支/循环、数据类型转换、数学函数、ASCII
        '分支问题': 2,
        '循环': 2,
      }

      let gespLevel = 0
      for (const tag of problemTags) {
        const lvl = tagToLevel[tag]
        if (lvl && lvl > gespLevel) gespLevel = lvl
      }

      // 若标签未命中任何映射，保留原标题前缀判断作为兜底
      if (gespLevel === 0) {
        const gespLevelMap: Record<string, number> = { '入门': 1, '基础': 3, '提高': 6 }
        gespLevel = gespLevelMap[levelPrefix] || 1
      }

      // 样例输入输出：优先从 markdown 的 input1/output1 代码块提取
      const mdSample = extractSampleFromMarkdown(mdRaw)
      let sampleInput = mdSample.input
      let sampleOutput = mdSample.output

      // 如果 markdown 没有提供，再从 testdata 第一个文件取
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

      // 读取 config.yaml
      let timeLimit = 1000
      let memoryLimit = 128
      const configPath = path.join(testdataDir, 'config.yaml')
      if (fs.existsSync(configPath)) {
        const configRaw = fs.readFileSync(configPath, 'utf-8')
        const config = simpleYamlParse(configRaw)
        timeLimit = parseLimit(config?.time, 1000)
        memoryLimit = parseLimit(config?.memory, 128)
      }

      // 读取所有测试数据
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

      // 构建标签（保留原始标签，不额外添加来源标签）
      const tags = meta.tag || []
      const tagsStr = tags.join(',')

      // 创建题目
      const problem = await prisma.problem.create({
        data: {
          tenantId,
          title: title.replace(/^【.+?】/, '').trim() || title,
          description: descriptionHtml,
          inputDesc: '',
          outputDesc: '',
          sampleInput,
          sampleOutput,
          sampleExplanation: '',
          starterCode: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}`,
          difficulty,
          tags: tagsStr,
          gespLevel,
          timeLimit,
          memoryLimit,
          status: 'active',
        },
      })

      // 均分分值
      const perScore = Math.floor(100 / testCases.length)

      // 创建测试用例
      for (let j = 0; j < testCases.length; j++) {
        const tc = testCases[j]
        await prisma.testCase.create({
          data: {
            problemId: problem.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: j > 0, // 第一个作为样例公开
            score: j === testCases.length - 1 ? 100 - perScore * (testCases.length - 1) : perScore,
            sortOrder: j + 1,
          },
        })
      }

      success++
      console.log(`✅ [${i + 1}/${dirs.length}] ${problem.title} (${testCases.length} 个测试点)`)
    } catch (err: any) {
      failed++
      console.error(`❌ [${i + 1}/${dirs.length}] 题目 ${dir} 导入失败:`, err.message)
    }
  }

  console.log(`\n🎉 导入完成：成功 ${success} 道，失败 ${failed} 道`)
}

main()
  .catch(e => {
    console.error('导入失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
