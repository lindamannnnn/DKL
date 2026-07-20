import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

const COURSES_DIR = path.join(__dirname, '../../courses/gesp1')
const BACKUP_FILE = path.join(__dirname, '../../gesp1-lessons-backup.json')
const COURSE_TITLE = 'GESP 1级：C++ 基础入门'

async function main() {
  // 1. 找到课程与章节
  const course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) throw new Error('课程不存在: ' + COURSE_TITLE)
  if (course.chapters.length === 0) throw new Error('课程没有章节')
  const chapterId = course.chapters[0].id

  // 2. 读取备份，建立旧标题 -> 课时 ID 的映射
  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8')) as {
    lessons: { id: string; title: string; sortOrder: number }[]
  }
  const oldTitleToId = new Map(backup.lessons.map((l: any) => [l.title, l.id]))

  // 新标题 -> 旧标题的对应关系（仅 12 节旧课）
  const newTitleToOldTitle: Record<string, string> = {
    '课程01：走进 C++': '课程01：走进 C++',
    '课程02：整数运算': '课程02：整数运算',
    '课程03：小数运算': '课程03：小数运算',
    '课程05：分支入门': '课程04：单双路分支',
    '课程07：多路分支': '课程05：多路分支',
    '课程09：字符类型与 switch': '课程06：字符类型与 switch',
    '课程10：for 循环': '课程07：for 循环',
    '课程11：循环控制': '课程08：循环控制',
    '课程13：求和计数': '课程09：求和计数',
    '课程14：while 循环': '课程10：while 循环',
    '课程15：短除法': '课程11：短除法',
    '课程17：C 风格输入输出': '课程12：C 风格输入输出',
  }

  // 3. 读取所有课件文件并按文件名排序
  const files = fs
    .readdirSync(COURSES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('README') && !f.startsWith('problem'))
    .sort()

  if (files.length !== 18) {
    throw new Error(`课件文件数量不是 18，当前为 ${files.length}`)
  }

  // 4. 先创建/更新课时
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const raw = fs.readFileSync(path.join(COURSES_DIR, file), 'utf-8')
    const titleMatch = raw.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '')
    const content = parseLessonMarkdown(raw)
    const sortOrder = i + 1

    const oldTitle = newTitleToOldTitle[title]
    const existingId = oldTitle ? oldTitleToId.get(oldTitle) : undefined

    if (existingId) {
      await prisma.lesson.update({
        where: { id: existingId },
        data: {
          title,
          sortOrder,
          content: content as any,
          rawMarkdown: raw,
        },
      })
      console.log(`✅ 更新旧课时: ${title} (${existingId})`)
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

  // 5. 清理可能多余的旧课时（理论上没有）
  const allLessons = await prisma.lesson.findMany({
    where: { chapterId },
    orderBy: { sortOrder: 'asc' },
  })
  if (allLessons.length !== 18) {
    console.warn(`⚠️ 课时总数为 ${allLessons.length}，不是 18`)
  }
  for (const l of allLessons) {
    console.log(`  ${l.sortOrder}. ${l.title}`)
  }

  console.log('\n🎉 迁移完成，学习进度已保留。')
}

main()
  .catch((e) => {
    console.error('迁移失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
