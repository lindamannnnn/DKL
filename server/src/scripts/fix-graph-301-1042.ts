import fs from 'fs'

const path = 'e:/DKL/docs/东方博宜第301-1042题分类_待审核.md'
let content = fs.readFileSync(path, 'utf-8')

const ids = [468, 470, 691, 692, 693, 694, 695, 900, 901, 902, 903]

for (const id of ids) {
  const re = new RegExp(`^\\| ${id} \\| .*? \\| .*? \\| .*? \\| .*? \\| .*? \\| CSP0\\d \\|`, 'gm')
  content = content.replace(re, (line) => {
    const cols = line.split('|').map(s => s.trim())
    cols[6] = '多层循环/图形'
    cols[7] = 'CSP02 |'
    return cols.join(' | ').replace(/^ \| /, '| ')
  })
}

fs.writeFileSync(path, content, 'utf-8')
console.log('done')
