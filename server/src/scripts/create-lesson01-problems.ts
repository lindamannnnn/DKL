/**
 * 为 01 课"课堂操作题"创建 5 道可评测题目
 * 运行：npx tsx src/scripts/create-lesson01-problems.ts
 */

import { prisma } from '../utils/prisma'

const TENANT_ID = '080ffa34-df87-4566-b1ef-555b88bfe5b8'

const problems = [
  {
    id: 'gesp1-01-01',
    title: '输出自我介绍',
    description: '<p>写一段完整的 C++ 程序，输出以下三行文字：</p><p>我叫小明</p><p>我今年10岁</p><p>我喜欢打篮球</p>',
    inputDesc: '无',
    outputDesc: '三行文字',
    sampleInput: '',
    sampleOutput: '我叫小明\n我今年10岁\n我喜欢打篮球',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [{ input: '', expectedOutput: '我叫小明\n我今年10岁\n我喜欢打篮球', score: 100 }],
  },
  {
    id: 'gesp1-01-02',
    title: '输出一行小星星',
    description: '<p>输出一排 10 个星号 <code>*</code>。</p>',
    inputDesc: '无',
    outputDesc: '10 个连续的星号',
    sampleInput: '',
    sampleOutput: '**********',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [{ input: '', expectedOutput: '**********', score: 100 }],
  },
  {
    id: 'gesp1-01-03',
    title: '读取并输出一个整数',
    description: '<p>输入一个整数，再把它原样输出。</p>',
    inputDesc: '一个整数 n',
    outputDesc: '同一个整数 n',
    sampleInput: '42',
    sampleOutput: '42',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '42', expectedOutput: '42', score: 50 },
      { input: '100', expectedOutput: '100', score: 50 },
    ],
  },
  {
    id: 'gesp1-01-04',
    title: '交换两个数的输出',
    description: '<p>输入两个整数，按相反顺序输出。</p>',
    inputDesc: '两个整数 a 和 b',
    outputDesc: '两个整数 b 和 a，中间用一个空格隔开',
    sampleInput: '3 5',
    sampleOutput: '5 3',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '3 5', expectedOutput: '5 3', score: 50 },
      { input: '10 20', expectedOutput: '20 10', score: 50 },
    ],
  },
  {
    id: 'gesp1-01-05',
    title: '格式化输出欢迎信息',
    description: '<p>输入一个姓名，输出 <code>欢迎你，XXX！</code> 并换行。</p>',
    inputDesc: '一个字符串 name',
    outputDesc: '欢迎你，name！',
    sampleInput: '小明',
    sampleOutput: '欢迎你，小明！',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '小明', expectedOutput: '欢迎你，小明！', score: 50 },
      { input: 'Tom', expectedOutput: '欢迎你，Tom！', score: 50 },
    ],
  },
]

async function main() {
  for (const p of problems) {
    await prisma.problem.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        inputDesc: p.inputDesc,
        outputDesc: p.outputDesc,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        starterCode: p.starterCode,
        tenantId: TENANT_ID,
        difficulty: 'easy',
        timeLimit: 1000,
        memoryLimit: 128,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        inputDesc: p.inputDesc,
        outputDesc: p.outputDesc,
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        starterCode: p.starterCode,
        tenantId: TENANT_ID,
        difficulty: 'easy',
        timeLimit: 1000,
        memoryLimit: 128,
      },
    })

    // 删除旧测试用例
    await prisma.testCase.deleteMany({ where: { problemId: p.id } })

    // 创建新测试用例
    for (let i = 0; i < p.testCases.length; i++) {
      const tc = p.testCases[i]
      await prisma.testCase.create({
        data: {
          problemId: p.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          score: tc.score,
          sortOrder: i,
          isHidden: false,
        },
      })
    }

    console.log(`✅ 题目 ${p.id} 创建/更新成功`)
  }

  console.log('\n🎉 01 课 5 道操作题创建完成')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
