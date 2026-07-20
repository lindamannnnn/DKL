import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

const COURSES_DIR = path.join(__dirname, '../../courses/gesp1')
const COURSE_TITLE = 'GESP 1级：C++ 基础入门'

async function main() {
  // 找到课程与章节
  const course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) throw new Error('课程不存在: ' + COURSE_TITLE)
  if (course.chapters.length === 0) throw new Error('课程没有章节')
  const chapterId = course.chapters[0].id

  // 读取现有课时，建立标题 -> ID 映射
  const existingLessons = await prisma.lesson.findMany({
    where: { chapterId },
  })
  const titleToId = new Map(existingLessons.map(l => [l.title, l.id]))

  // 读取课件文件
  const files = fs
    .readdirSync(COURSES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('README') && !f.startsWith('problem'))
    .sort()

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const raw = fs.readFileSync(path.join(COURSES_DIR, file), 'utf-8')
    const titleMatch = raw.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '')
    const content = parseLessonMarkdown(raw)
    const sortOrder = i + 1

    const existingId = titleToId.get(title)
    if (existingId) {
      await prisma.lesson.update({
        where: { id: existingId },
        data: {
          sortOrder,
          content: content as any,
          rawMarkdown: raw,
        },
      })
      console.log(`✅ 更新课时: ${title}`)
    } else {
      await prisma.lesson.create({
        data: {
          chapterId,
          title,
          sortOrder,
          duration: 120,
          content: content as any,
          rawMarkdown: raw,
        },
      })
      console.log(`✅ 创建新课: ${title}`)
    }
  }

  console.log('\n🎉 GESP 1级课件内容更新完成，学习进度已保留。')
}

main()
  .catch((e) => {
    console.error('更新失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
