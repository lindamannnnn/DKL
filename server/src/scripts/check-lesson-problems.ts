import { prisma } from '../utils/prisma'

async function main() {
  const lesson = await prisma.lesson.findFirst({
    where: { title: { contains: '分支大冒险' } },
    select: { title: true, content: true }
  })
  if (!lesson) {
    console.log('课时不存在')
    return
  }
  const blocks = Array.isArray(lesson.content) ? lesson.content : []
  const problemBlocks = blocks.filter((b: any) => b.type === 'problem' || b.metadata?.problemId)
  console.log('课时:', lesson.title)
  console.log('总块数:', blocks.length)
  console.log('problem 块数:', problemBlocks.length)
  problemBlocks.forEach((b: any, i: number) => {
    console.log(i + 1, b.type, b.metadata?.problemId, JSON.stringify(b).slice(0, 100))
  })
}

main().finally(() => prisma.$disconnect())
