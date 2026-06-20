import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'
import { parseLessonMarkdown } from '../parsers/markdownParser'

const COURSES_DIR = path.join(__dirname, '../../courses/gesp2')
const COURSE_TITLE = 'GESP 2级：C++ 进阶'

async function cleanupExistingCourse(title: string) {
  const existing = await prisma.course.findFirst({
    where: { title },
    include: {
      chapters: {
        include: {
          lessons: { select: { id: true } }
        }
      }
    }
  })

  if (existing) {
    const lessonIds = existing.chapters.flatMap(ch => ch.lessons.map(l => l.id))
    if (lessonIds.length > 0) {
      await prisma.learningProgress.deleteMany({
        where: { lessonId: { in: lessonIds } }
      })
    }
    await prisma.course.delete({
      where: { id: existing.id }
    })
    console.log('✅ 清理旧课程数据:', title)
  }
}

async function main() {
  // 只清理当前课程的旧数据，保留其他课程
  await cleanupExistingCourse(COURSE_TITLE)

  // 读取课程目录下的所有 markdown 课件
  const files = fs.readdirSync(COURSES_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('README') && !f.startsWith('problem'))
    .sort()

  // 创建课程
  const course = await prisma.course.create({
    data: {
      tenantId: process.env.DEFAULT_TENANT_ID || '080ffa34-df87-4566-b1ef-555b88bfe5b8',
      title: COURSE_TITLE,
      description: '在 GESP 1级基础上深入学习数学函数、自定义函数、数据类型转换、多层分支与循环、图形打印及计算机存储与网络知识，适合小学 4-6 年级学生。',
      levelMin: 2,
      levelMax: 2,
      status: 'published',
    },
  })
  console.log('✅ 创建课程:', course.title)

  // 创建章节
  const chapter = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第1章：GESP 2级核心课程',
      sortOrder: 1,
    },
  })

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const raw = fs.readFileSync(path.join(COURSES_DIR, file), 'utf-8')

    // 从第一行 # 标题提取课程名
    const titleMatch = raw.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '')

    // 整个文件作为一个课时
    const content = parseLessonMarkdown(raw)

    await prisma.lesson.create({
      data: {
        chapterId: chapter.id,
        title,
        sortOrder: i + 1,
        duration: 120,
        content: content as any,
        rawMarkdown: raw,
      },
    })
    console.log('✅ 创建课时:', title)
  }

  console.log('\n🎉 GESP 2级课程导入完成，共', files.length, '个课时')
}

main()
  .catch(e => {
    console.error('导入失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
