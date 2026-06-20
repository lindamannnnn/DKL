import { prisma } from '../utils/prisma'

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, tenantId: true },
  })
  console.log('Users:', JSON.stringify(users, null, 2))
}

main().finally(() => prisma.$disconnect())
