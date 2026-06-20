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

// 按优先级排列的规则，越早越优先（高优先级覆盖低优先级）
const rules: Array<{ re: RegExp; level: number; label: string }> = [
  // CSP08
  { re: /快速幂|矩阵快速幂/, level: 8, label: '快速幂' },
  { re: /并查集/, level: 8, label: '并查集' },
  { re: /最小生成树|Kruskal|Prim/, level: 8, label: '最小生成树' },
  { re: /最短路|Dijkstra|Floyd|SPFA|Bellman/, level: 8, label: '最短路' },
  { re: /拓扑排序/, level: 8, label: '拓扑排序' },
  { re: /计数原理|排列组合|杨辉三角|组合数|C\(|A\(/, level: 8, label: '计数原理' },
  // CSP07
  { re: /图论|图\s*的|有向图|无向图|连通块|连通分量/, level: 7, label: '图论' },
  { re: /哈希|hash|Hash/, level: 7, label: '哈希' },
  { re: /LIS|最长上升子序列|最长递增子序列/, level: 7, label: 'LIS' },
  { re: /LCS|最长公共子序列/, level: 7, label: 'LCS' },
  { re: /区间DP/, level: 7, label: '区间DP' },
  { re: /二维前缀和|二维差分/, level: 7, label: '前缀和/差分' },
  // CSP06
  { re: /01背包|完全背包|多重背包|分组背包|背包问题|背包/, level: 6, label: '背包' },
  { re: /动态规划|DP|dp/, level: 6, label: '动态规划' },
  { re: /深搜|DFS|dfs|回溯|全排列|排列组合生成/, level: 6, label: '深搜/回溯' },
  { re: /广搜|BFS|bfs|最短路.*无权/, level: 6, label: '广搜' },
  { re: /二叉树|哈夫曼树|哈夫曼编码|BST|二叉搜索树|完全二叉树|树形DP|树上差分|树的直径|树的重心|LCA|最近公共祖先/, level: 6, label: '树' },
  { re: /栈|队列|循环队列|单调栈|单调队列/, level: 6, label: '栈/队列' },
  // CSP05
  { re: /高精度/, level: 5, label: '高精度' },
  { re: /递归|汉诺塔|斐波那契|Fibonacci|自然数.?分解|拆分/, level: 5, label: '递归' },
  { re: /分治|归并排序|快速排序/, level: 5, label: '分治' },
  { re: /二分查找|二分答案|二分/, level: 5, label: '二分' },
  { re: /贪心/, level: 5, label: '贪心' },
  { re: /埃筛|线性筛|筛法|素数表|质因数分解|唯一分解|GCD|gcd|LCM|lcm|最大公约数|最小公倍数|辗转相除|欧几里得|同余|逆元|费马小定理|欧拉定理/, level: 5, label: '数论' },
  // CSP04
  { re: /排序|sort|冒泡|插入排序|选择排序/, level: 4, label: '排序' },
  { re: /二维数组|矩阵|方阵|数独|迷宫.*数组|n\*m|n×m/, level: 4, label: '二维数组' },
  { re: /递推|Pell|菲波那契|斐波那契|骨牌铺方格|平面分割|位数问题| Catalan|卡特兰/, level: 4, label: '递推' },
  { re: /结构体|指针|文件操作/, level: 4, label: '结构体/指针' },
  // CSP03
  { re: /字符串|string|字符数组|密码|加密|解密|压缩|解压|子串|子序列|前缀|后缀/, level: 3, label: '字符串' },
  { re: /进制转换|二进制|八进制|十六进制|位运算|按位|异或运算/, level: 3, label: '进制转换/位运算' },
  { re: /枚举/, level: 3, label: '枚举' },
  { re: /模拟/, level: 3, label: '模拟' },
  { re: /数组问题|数组\s|一维数组|数组插入|数组删除|数组排序|数组逆序/, level: 3, label: '数组' },
  // CSP02
  { re: /函数问题|自定义函数|函数/, level: 2, label: '函数' },
  { re: /多层循环|嵌套循环|图形打印|打印图形|输出如下图形|轴对称|字母塔|金字塔|菱形|沙漏|蝴蝶结|箭头|乘法表|九九乘法表|数字矩形|数字图形|数字三角|for.*for|while.*while/, level: 2, label: '多层循环/图形' },
  { re: /数学函数|sqrt|abs\(|max\(|min\(|round\(|rand\(|π|pi|圆周率/, level: 2, label: '数学函数' },
  // CSP01
  { re: /基础问题|分支问题|分支结构|if|else|switch|三目/, level: 1, label: '基础/分支' },
  { re: /循环结构|数字拆位|水仙花数|回文数|质数判断|因子和|最大公约|最小公倍|闰年|奇偶|倍数/, level: 1, label: '循环/基础' },
]

function autoClassify(num: number, prefix: string, tags: string[], title: string, desc: string): [string, number] {
  const text = `${prefix} ${tags.join(' ')} ${title} ${desc}`

  let level = 0
  let label = ''
  for (const rule of rules) {
    if (rule.re.test(text)) {
      level = rule.level
      label = rule.label
      break // 按优先级，第一个匹配即生效
    }
  }

  // 兜底
  if (level === 0) {
    if (prefix === '入门') {
      level = 1
      label = '基础问题'
    } else if (prefix === '基础') {
      level = 2
      label = '函数/多层循环'
    } else if (prefix === '提高') {
      level = 5
      label = '递归/数论'
    } else {
      level = 1
      label = '基础问题'
    }
  }

  return [label, level]
}

const dirs = fs.readdirSync(PROBLEMS_DIR)
  .filter(d => /^\d+$/.test(d))
  .map(d => parseInt(d))
  .sort((a, b) => a - b)
  .filter(d => d >= 301 && d <= 1042)

const rows: { idx: number; title: string; prefix: string; tags: string[]; desc: string; label: string; level: number }[] = []

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

  const [label, level] = autoClassify(num, prefix, tags, title, desc)
  rows.push({ idx: num, title, prefix, tags, desc, label, level })
}

console.log('# 东方博宜 OJ 第 301~1042 题分类（待审核，按 DKL CSP 阶段 + 数据范围）\n')
console.log('| 编号 | 题目 | 原前缀 | 原标签 | 题面描述 | 建议标签 | 建议等级 |')
console.log('| --- | --- | --- | --- | --- | --- | --- |')
for (const r of rows) {
  console.log(`| ${r.idx} | ${r.title} | ${r.prefix} | ${r.tags.join(', ')} | ${r.desc} | ${r.label} | CSP0${r.level} |`)
}
