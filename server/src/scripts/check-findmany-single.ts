import { prisma } from '../utils/prisma'

async function main() {
  const id = '2befbf8a-41dc-49e6-a05b-4d440899e51'
  const r1 = await prisma.problem.findMany({ where: { id: { in: [id] } }, select: { id: true, title: true } })
  console.log('findMany single:', r1.length, r1.map(p => p.title))
  
  const r2 = await prisma.problem.findMany({ where: { id: { in: [id, '4bea5408-c110-41f1-8fde-59024c5d6a7d'] } }, select: { id: true, title: true } })
  console.log('findMany two:', r2.length, r2.map(p => p.title))

  const r3 = await prisma.problem.findUnique({ where: { id }, select: { id: true, title: true } })
  console.log('findUnique:', r3)
}

main().finally(() => prisma.$disconnect())
