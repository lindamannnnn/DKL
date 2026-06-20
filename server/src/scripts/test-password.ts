import bcrypt from 'bcryptjs'
import { prisma } from '../utils/prisma'

async function main() {
  const user = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: '080ffa34-df87-4566-b1ef-555b88bfe5b8', email: 'student@dkl.local' } },
  })
  if (!user) {
    console.log('找不到学生账号')
    return
  }
  console.log('数据库里的密码哈希:', user.password.slice(0, 30) + '...')
  console.log('123456 是否正确:', await bcrypt.compare('123456', user.password))
  console.log('student123 是否正确:', await bcrypt.compare('student123', user.password))
}

main().finally(() => prisma.$disconnect())
