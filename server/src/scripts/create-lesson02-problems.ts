/**
 * 为 02 课"课堂操作题"创建 5 道可评测题目
 * 运行：npx tsx src/scripts/create-lesson02-problems.ts
 */

import { prisma } from '../utils/prisma'

const TENANT_ID = '080ffa34-df87-4566-b1ef-555b88bfe5b8'

const problems = [
  {
    id: 'gesp1-02-01',
    title: '计算长方形周长',
    description: '<p>输入长方形的长和宽，计算并输出它的周长。</p><p>周长公式：<code>周长 = (长 + 宽) × 2</code></p>',
    inputDesc: '两个整数 a 和 b，分别表示长方形的长和宽',
    outputDesc: '一个整数，表示长方形的周长',
    sampleInput: '3 4',
    sampleOutput: '14',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '3 4', expectedOutput: '14', score: 50 },
      { input: '5 6', expectedOutput: '22', score: 50 },
    ],
  },
  {
    id: 'gesp1-02-02',
    title: '计算三门课平均分',
    description: '<p>输入三门课的成绩，输出它们的平均分。</p><p>注意：结果用整数除法，直接去掉小数部分。</p>',
    inputDesc: '三个整数，分别表示三门课的成绩',
    outputDesc: '一个整数，表示平均分',
    sampleInput: '80 90 100',
    sampleOutput: '90',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '80 90 100', expectedOutput: '90', score: 50 },
      { input: '70 80 90', expectedOutput: '80', score: 50 },
    ],
  },
  {
    id: 'gesp1-02-03',
    title: '求两个数的余数',
    description: '<p>输入两个整数 a 和 b，输出 a 除以 b 的余数。</p>',
    inputDesc: '两个整数 a 和 b',
    outputDesc: 'a 除以 b 的余数',
    sampleInput: '10 3',
    sampleOutput: '1',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '10 3', expectedOutput: '1', score: 34 },
      { input: '17 5', expectedOutput: '2', score: 33 },
      { input: '20 4', expectedOutput: '0', score: 33 },
    ],
  },
  {
    id: 'gesp1-02-04',
    title: '三位数各位数字之和',
    description: '<p>输入一个三位数，输出它各位数字之和。</p>',
    inputDesc: '一个三位数 n',
    outputDesc: '各位数字之和',
    sampleInput: '123',
    sampleOutput: '6',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '123', expectedOutput: '6', score: 34 },
      { input: '456', expectedOutput: '15', score: 33 },
      { input: '100', expectedOutput: '1', score: 33 },
    ],
  },
  {
    id: 'gesp1-02-05',
    title: '交换两位数的个位和十位',
    description: '<p>输入一个两位数，交换它的个位和十位后输出。</p><p>例如输入 <code>34</code>，输出 <code>43</code>。</p>',
    inputDesc: '一个两位数 n',
    outputDesc: '交换个位和十位后的整数',
    sampleInput: '34',
    sampleOutput: '43',
    starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
    testCases: [
      { input: '34', expectedOutput: '43', score: 34 },
      { input: '10', expectedOutput: '1', score: 33 },
      { input: '89', expectedOutput: '98', score: 33 },
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

  console.log('\n🎉 02 课 5 道操作题创建完成')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
