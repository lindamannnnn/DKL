import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

const NEW_MD = path.join(__dirname, '../../../tmp/gesp2_new_lesson13.md')
const COURSE_TITLE = 'GESP 2级：C++ 进阶'
const INSERT_AFTER_SORT = 12 // 插到第 12 课之后 -> 成为 13

async function main() {
  const raw = fs.readFileSync(NEW_MD, 'utf-8')
  const titleMatch = raw.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : '课程13：循环模拟与易错点专项'

  // 找到课程的唯一章节
  const course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) throw new Error('课程不存在: ' + COURSE_TITLE)
  const chapter = course.chapters[0]

  // 检查是否已存在同名课（避免重复插入）
  const dup = await prisma.lesson.findFirst({
    where: { chapterId: chapter.id, title },
  })
  if (dup) {
    console.log('⚠️ 已存在同名课时，跳过插入:', title, 'id=', dup.id)
    return
  }

  // 1) 把 sort_order > 12 的课全部 +1（从大到小避免冲突）
  const toShift = await prisma.lesson.findMany({
    where: { chapterId: chapter.id, sortOrder: { gt: INSERT_AFTER_SORT } },
    orderBy: { sortOrder: 'desc' },
  })
  for (const l of toShift) {
    await prisma.lesson.update({
      where: { id: l.id },
      data: { sortOrder: l.sortOrder + 1 },
    })
    console.log(`顺延: sortOrder ${l.sortOrder} -> ${l.sortOrder + 1}  (${l.title})`)
  }

  // 2) 插入新课为 sortOrder = 13
  const content = parseLessonMarkdown(raw)
  const lesson = await prisma.lesson.create({
    data: {
      chapterId: chapter.id,
      title,
      sortOrder: INSERT_AFTER_SORT + 1,
      duration: 120,
      content: content as any,
      rawMarkdown: raw,
    },
  })
  console.log('\n✅ 插入新课:', title, 'sortOrder=13 id=', lesson.id)

  // 3) 校验：打印 content 块统计 + problem 数
  const probs = (content as any[]).filter((b) => b.type === 'problem')
  const cps = (content as any[]).filter((b) => b.type === 'checkpoint')
  console.log(`content 块数=${(content as any[]).length} problem=${probs.length} checkpoint=${cps.length}`)
}

main()
  .catch((e) => { console.error('失败:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
