import { prisma } from '../utils/prisma'

async function main() {
  const result = await prisma.$queryRaw`
    SELECT id, title, tenant_id FROM problems 
    WHERE id IN ('4bea5408-c110-41f1-8fde-59024c5d6a7d','8c0c8cf9-1500-4546-8aed-dc383d28c6f1','2befbf8a-41dc-49e6-a05b-a4d440899e51','42de8ae8-1de0-4918-baea-3a4160afb117','8c2c907c-5027-45e7-91a0-2cecc22e5a6d')
    AND tenant_id = '080ffa34-df87-4566-b1ef-555b88bfe5b8'
  `
  console.log('raw sql count:', (result as any[]).length)
  ;(result as any[]).forEach(r => console.log(r.id, r.title, r.tenant_id))
}

main().finally(() => prisma.$disconnect())
