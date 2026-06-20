import fs from 'fs'

const path = 'e:/DKL/docs/东方博宜第301-1042题分类_待审核.md'
let content = fs.readFileSync(path, 'utf-8')

// 编号 -> [新标签, 新等级]
const corrections: Record<number, [string, number]> = {
  239: ['数组', 3],
  323: ['广搜', 6],
  365: ['循环结构, 数字拆位', 1],
  382: ['数组', 3],
  389: ['二分', 5],
  397: ['动态规划', 6],
  409: ['广搜', 6],
  418: ['广搜', 6],
  477: ['数组, 增删', 3],
  478: ['排序', 4],
  521: ['广搜', 6],
  587: ['数字拆位', 1],
  595: ['数字拆位', 1],
  713: ['数字拆位', 1],
  826: ['广搜', 6],
  836: ['二分', 5],
  843: ['二维数组', 4],
  868: ['数论, 埃筛', 5],
  892: ['深搜/广搜', 6],
  992: ['深搜/广搜', 6],
  1027: ['模拟', 3],
  433: ['循环结构, 数字拆位', 1],
  492: ['多层循环, 枚举', 2],
  561: ['数组, 枚举', 3],
  862: ['动态规划', 6],
  876: ['深搜/广搜', 6],
  914: ['广搜', 6],
}

for (const [id, [label, level]] of Object.entries(corrections)) {
  const re = new RegExp(`^\\| ${id} \\| .*? \\| .*? \\| .*? \\| .*? \\| .*? \\| CSP0\\d \\|`, 'gm')
  content = content.replace(re, (line) => {
    const cols = line.split('|').map(s => s.trim())
    cols[6] = label
    cols[7] = `CSP0${level}`
    return cols.join(' | ').replace(/^ \| /, '| ')
  })
}

fs.writeFileSync(path, content, 'utf-8')
console.log('done')
