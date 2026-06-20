import { prisma } from './src/utils/prisma'
async function main() {
  const p = await prisma.problem.findFirst({ where: { title: '判断成绩等级' } })
  if (p) {
    console.log('title:', p.title)
    console.log('inputDesc:', JSON.stringify(p.inputDesc))
    console.log('outputDesc:', JSON.stringify(p.outputDesc))
    console.log('sampleInput:', JSON.stringify(p.sampleInput))
    console.log('sampleOutput:', JSON.stringify(p.sampleOutput))
    console.log('description length:', p.description.length)
    console.log('description preview:', p.description.slice(0, 800))
  }
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
