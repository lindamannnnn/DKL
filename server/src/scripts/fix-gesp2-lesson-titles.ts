import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

/**
 * 修正 GESP2 第 14/15/16 课的标题编号。
 * 背景：插入新第 13 课「循环模拟与易错点专项」时只调整了 sortOrder，
 * 原 13/14/15 课的标题仍显示「课程13/14/15」。本脚本按 sortOrder 定位，
 * 从冻结版源文件同步 title + rawMarkdown + content。
 *
 * 运行：npx tsx src/scripts/fix-gesp2-lesson-titles.ts
 */

const COURSES_DIR = path.join(__dirname, '../../courses/gesp2')
const COURSE_TITLE = 'GESP 2级：C++ 进阶'

const TARGETS = [
  { sortOrder: 14, file: '14-练习课-GESP2综合大闯关.md' },
  { sortOrder: 15, file: '15-真题练习1.md' },
  { sortOrder: 16, file: '16-真题练习2.md' },
]

async function main() {
  const course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) throw new Error('课程不存在: ' + COURSE_TITLE)
  const chapterId = course.chapters[0].id

  // 先打印当前 16 课标题，确认无重复/缺失
  const lessons = await prisma.lesson.findMany({
    where: { chapterId },
    orderBy: { sortOrder: 'asc' },
    select: { sortOrder: true, title: true },
  })
  console.log(`当前共 ${lessons.length} 课：`)
  for (const l of lessons) console.log(`  ${l.sortOrder}. ${l.title}`)

  for (const t of TARGETS) {
    const raw = fs.readFileSync(path.join(COURSES_DIR, t.file), 'utf-8')
    const titleMatch = raw.match(/^#\s+(.+)$/m)
    if (!titleMatch) throw new Error(`无法从 ${t.file} 解析标题`)
    const title = titleMatch[1].trim()

    const lesson = await prisma.lesson.findFirst({
      where: { chapterId, sortOrder: t.sortOrder },
    })
    if (!lesson) throw new Error(`sortOrder=${t.sortOrder} 课时不存在`)

    await prisma.lesson.update({
      where: { id: lesson.id },
      data: {
        title,
        rawMarkdown: raw,
        content: parseLessonMarkdown(raw) as any,
      },
    })
    console.log(`\n✅ sortOrder=${t.sortOrder} 标题修正:`)
    console.log(`   旧: ${lesson.title}`)
    console.log(`   新: ${title}`)
  }

  console.log('\n🎉 标题修正完成，学习进度不受影响（按 id 关联）。')
}

main()
  .catch((e) => {
    console.error('失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
