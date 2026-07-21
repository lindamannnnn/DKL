import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

/**
 * GESP 3级课件导入/同步脚本（幂等，可重复运行）
 * - 课程不存在则创建
 * - 按标题匹配课时：存在则更新内容，不存在则创建
 * - 不会删除学习进度
 *
 * 运行：npx tsx src/scripts/import-gesp3.ts
 */

const COURSES_DIR = path.join(__dirname, '../../courses/gesp3')
const COURSE_TITLE = 'GESP 3级：数组与字符串'

async function main() {
  // 1) 找到或创建课程
  let course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE },
    include: { chapters: true },
  })
  if (!course) {
    course = await prisma.course.create({
      data: {
        tenantId: process.env.DEFAULT_TENANT_ID || '080ffa34-df87-4566-b1ef-555b88bfe5b8',
        title: COURSE_TITLE,
        description:
          '在 GESP 2级基础上学习一维数组、字符数组与 string、枚举与模拟算法、进制转换、数据编码与位运算，适合小学 4-6 年级学生。',
        levelMin: 3,
        levelMax: 3,
        status: 'published',
      },
      include: { chapters: true },
    })
    console.log('✅ 创建课程:', course.title)
  } else {
    console.log('📦 课程已存在:', course.title)
  }

  // 2) 找到或创建章节
  let chapter = course.chapters[0]
  if (!chapter) {
    chapter = await prisma.chapter.create({
      data: {
        courseId: course.id,
        title: '第1章：GESP 3级核心课程',
        sortOrder: 1,
      },
    })
    console.log('✅ 创建章节:', chapter.title)
  }

  // 3) 读取课件目录，按标题 upsert 课时
  const files = fs
    .readdirSync(COURSES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('README') && !f.startsWith('problem'))
    .sort()

  const existingLessons = await prisma.lesson.findMany({
    where: { chapterId: chapter.id },
  })
  const titleToId = new Map(existingLessons.map((l) => [l.title, l.id]))

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
        data: { sortOrder, content: content as any, rawMarkdown: raw },
      })
      console.log(`✅ 更新课时: ${sortOrder}. ${title}`)
    } else {
      await prisma.lesson.create({
        data: {
          chapterId: chapter.id,
          title,
          sortOrder,
          duration: 120,
          content: content as any,
          rawMarkdown: raw,
        },
      })
      console.log(`✅ 创建课时: ${sortOrder}. ${title}`)
    }
  }

  console.log(`\n🎉 GESP 3级课程同步完成，共 ${files.length} 个课时`)
}

main()
  .catch((e) => {
    console.error('导入失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
