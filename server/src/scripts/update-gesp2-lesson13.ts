import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

const NEW_MD = path.join(__dirname, '../../../tmp/gesp2_new_lesson13.md')
const COURSE_TITLE = 'GESP 2级：C++ 进阶'
const SORT = 13

async function main() {
  const raw = fs.readFileSync(NEW_MD, 'utf-8')
  const course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) throw new Error('课程不存在')
  const chapter = course.chapters[0]

  const lesson = await prisma.lesson.findFirst({
    where: { chapterId: chapter.id, sortOrder: SORT },
  })
  if (!lesson) throw new Error('第13课不存在')

  const content = parseLessonMarkdown(raw)
  await prisma.lesson.update({
    where: { id: lesson.id },
    data: { content: content as any, rawMarkdown: raw },
  })

  const probs = (content as any[]).filter((b) => b.type === 'problem')
  const cps = (content as any[]).filter((b) => b.type === 'checkpoint')
  console.log('✅ 更新第13课:', lesson.title)
  console.log(`content 块数=${(content as any[]).length} problem=${probs.length} checkpoint=${cps.length}`)

  // 校验数组已去掉、新页面已加入
  const raw2 = raw
  console.log('含数组 int h[:', raw2.includes('int h['))
  console.log('含嵌套循环套 break 页:', raw2.includes('嵌套循环套 break'))
  console.log('含浮点精度页:', raw2.includes('浮点精度'))
}

main()
  .catch((e) => { console.error('失败:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
