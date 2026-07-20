import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

const MD = path.join(__dirname, '../../../tmp/gesp2_md_db/L05.md')
const COURSE_TITLE = 'GESP 2级：C++ 进阶'
const SORT = 5

async function main() {
  const raw = fs.readFileSync(MD, 'utf-8')
  const course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) throw new Error('课程不存在')
  const lesson = await prisma.lesson.findFirst({
    where: { chapterId: course.chapters[0].id, sortOrder: SORT },
  })
  if (!lesson) throw new Error('第5课不存在')

  const content = parseLessonMarkdown(raw)
  await prisma.lesson.update({
    where: { id: lesson.id },
    data: { content: content as any, rawMarkdown: raw },
  })

  const probs = (content as any[]).filter((b) => b.type === 'problem')
  const cps = (content as any[]).filter((b) => b.type === 'checkpoint')
  console.log('✅ 更新第5课:', lesson.title)
  console.log(`content 块数=${(content as any[]).length} problem=${probs.length} checkpoint=${cps.length}`)
  console.log('含枚举去重页:', raw.includes('枚举别重复数'))
  console.log('含 for (b = a:', raw.includes('for (int b = a'))
}

main()
  .catch((e) => { console.error('失败:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
