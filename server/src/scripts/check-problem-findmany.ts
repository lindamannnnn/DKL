import { prisma } from '../utils/prisma'

async function main() {
  const ids = [
    '4bea5408-c110-41f1-8fde-59024c5d6a7d',
    '8c0c8cf9-1500-4546-8aed-dc383d28c6f1',
    '2befbf8a-41dc-49e6-a05b-a4d440899e51',
    '42de8ae8-1de0-4918-baea-3a4160afb117',
    '8c2c907c-5027-45e7-91a0-2cecc22e5a6d',
  ]
  const problems = await prisma.problem.findMany({
    where: {
      id: { in: ids },
      tenantId: '080ffa34-df87-4566-b1ef-555b88bfe5b8',
    },
    select: { id: true, title: true },
  })
  console.log('返回数量:', problems.length)
  problems.forEach(p => console.log(p.id, p.title))
}

main().finally(() => prisma.$disconnect())
