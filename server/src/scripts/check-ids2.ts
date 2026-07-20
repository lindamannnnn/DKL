import { prisma } from '../utils/prisma'

async function main() {
  const lesson = await prisma.lesson.findFirst({
    where: { title: { contains: '分支大冒险' } },
    select: { content: true }
  })
  const blocks = Array.isArray(lesson?.content) ? lesson!.content as any[] : []
  const pids = blocks.filter(b => b.type === 'problem' && b.metadata?.problemId).map(b => b.metadata.problemId)
  
  const hardcoded = [
    '4bea5408-c110-41f1-8fde-59024c5d6a7d',
    '8c0c8cf9-1500-4546-8aed-dc383d28c6f1',
    '2befbf8a-41dc-49e6-a05b-4d440899e51',
    '42de8ae8-1de0-4918-baea-3a4160afb117',
    '8c2c907c-5027-45e7-91a0-2cecc22e5a6d',
  ]

  console.log('compare:')
  for (let i = 0; i < pids.length; i++) {
    const fromContent = pids[i]
    const fromHard = hardcoded[i]
    console.log(i, fromContent === fromHard, JSON.stringify(fromContent), JSON.stringify(fromHard))
  }

  console.log('\nquery with content ids:')
  const r1 = await prisma.problem.findMany({ where: { id: { in: pids } }, select: { id: true, title: true } })
  console.log(r1.length, r1.map(p => p.title))

  console.log('\nquery with hardcoded ids:')
  const r2 = await prisma.problem.findMany({ where: { id: { in: hardcoded } }, select: { id: true, title: true } })
  console.log(r2.length, r2.map(p => p.title))
}

main().finally(() => prisma.$disconnect())
