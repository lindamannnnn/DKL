import { prisma } from '../utils/prisma'

async function main() {
  const p = await prisma.problem.findUnique({
    where: { id: '2befbf8a-41dc-49e6-a05b-a4d440899e51' },
  })
  console.log(p)
}

main().finally(() => prisma.$disconnect())
