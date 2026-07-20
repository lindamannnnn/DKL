import { prisma } from '../utils/prisma'

async function main() {
  const lesson = await prisma.lesson.findFirst({
    where: { title: { contains: '分支大冒险' } },
    select: { content: true }
  })
  const blocks = Array.isArray(lesson?.content) ? lesson!.content as any[] : []
  const pids = blocks.filter(b => b.type === 'problem' && b.metadata?.problemId).map(b => b.metadata.problemId)
  console.log('lesson content problemIds:')
  pids.forEach((id, i) => console.log(i+1, JSON.stringify(id), Buffer.from(id).toString('hex')))

  const problems = await prisma.problem.findMany({
    where: { id: { in: pids } },
    select: { id: true, title: true }
  })
  console.log('\nproblems found:', problems.length)
  problems.forEach(p => console.log(JSON.stringify(p.id), Buffer.from(p.id).toString('hex'), p.title))
}

main().finally(() => prisma.$disconnect())
