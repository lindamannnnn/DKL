import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始播种初始数据...')

  // 1. 创建默认租户
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: '默认机构',
      slug: 'default',
    },
  })
  console.log('✅ 租户:', tenant.name)

  // 2. 创建演示管理员
  const admin = await prisma.user.upsert({
    where: { id: 'admin-default' },
    update: {},
    create: {
      id: 'admin-default',
      tenantId: tenant.id,
      email: 'admin@dkl.local',
      username: '管理员',
      password: '$2a$10$8ZMVq50oLU0iIVz2yNCPN.AjqrjBj6/SU7Xz.jhot2aylEk/rUwly', // admin123
      role: 'admin',
    },
  })
  console.log('✅ 管理员:', admin.username)

  // 3. 创建演示教师
  const teacher = await prisma.user.upsert({
    where: { id: 'teacher-default' },
    update: {},
    create: {
      id: 'teacher-default',
      tenantId: tenant.id,
      email: 'teacher@dkl.local',
      username: '李老师',
      password: '$2a$10$WNxAWQbp6WFkinO0d4l9Per3QnIa8jF7QT0JkQEIFJvqKuDHan19S', // teacher123
      role: 'teacher',
    },
  })
  console.log('✅ 教师:', teacher.username)

  // 4. 创建演示学生
  const student = await prisma.user.upsert({
    where: { id: 'student-default' },
    update: {},
    create: {
      id: 'student-default',
      tenantId: tenant.id,
      email: 'student@dkl.local',
      username: '小明',
      password: '$2a$10$Y8JzDKqdCsJ9n5L1MTgX7e3wT967/vd5qyC0NbhUf3fFhlNWirg5a', // student123
      role: 'student',
    },
  })
  console.log('✅ 学生:', student.username)

  // 5. 创建演示课程：GESP 1级
  const course = await prisma.course.upsert({
    where: { id: 'gesp-1-demo' },
    update: {},
    create: {
      id: 'gesp-1-demo',
      tenantId: tenant.id,
      title: 'GESP 1级：C++ 基础入门',
      description: '从零开始学习 C++，覆盖变量、数据类型、输入输出等基础语法',
      levelMin: 1,
      levelMax: 1,
      status: 'published',
    },
  })
  console.log('✅ 课程:', course.title)

  // 6. 创建章节
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第1章：你好 C++',
      sortOrder: 1,
    },
  })

  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: '第2章：变量与计算',
      sortOrder: 2,
    },
  })
  console.log('✅ 章节:', chapter1.title, chapter2.title)

  // 7. 创建课时
  const lesson1 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: '课时 1-1：第一个程序',
      sortOrder: 1,
      content: JSON.stringify([
        { type: 'markdown', content: '今天我们要学习让电脑说话！\n\n在 C++ 中，我们使用 `cout` 来输出内容。' },
        { type: 'code', content: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!";\n    return 0;\n}', language: 'cpp', metadata: { runnable: true } },
        { type: 'markdown', content: '> 💡 教练提示：每一句话末尾都要加英文分号 `;`，就像句号一样！' },
        { type: 'quiz', content: '上面程序的输出是什么？\n- A. Hello, C++!\n- B. hello, c++!\n- C. 什么都不输出', metadata: { type: 'choice', answer: 'A' } },
        { type: 'problem', content: '', metadata: { problemId: 'gesp1-001' } },
      ]),
      rawMarkdown: `# 课时1-1 第一个程序
今天我们要学习让电脑说话！\n\n\`\`\`cpp
#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!";\n    return 0;\n}\n\`\`\`\n<!-- run -->\n\n> 教练提示：每一句话末尾都要加英文分号 \`;\`，就像句号一样！\n\n<!-- quiz: choice -->\n上面程序的输出是什么？\n- A. Hello, C++!\n- B. hello, c++!\n- C. 什么都不输出\n<!-- answer: A -->\n\n<!-- problem: gesp1-001 -->`,
      duration: 10,
    },
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      chapterId: chapter1.id,
      title: '课时 1-2：cout 输出',
      sortOrder: 2,
      content: JSON.stringify([
        { type: 'markdown', content: '`cout` 是 C++ 中用于输出的工具。\n\n你可以用它来输出文字、数字，甚至数学计算的结果！' },
        { type: 'code', content: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << 2 + 3;\n    return 0;\n}', language: 'cpp', metadata: { runnable: true } },
      ]),
      duration: 10,
    },
  })

  const lesson3 = await prisma.lesson.create({
    data: {
      chapterId: chapter2.id,
      title: '课时 2-1：变量是什么',
      sortOrder: 1,
      content: JSON.stringify([
        { type: 'markdown', content: '变量就像一个有名字的盒子，你可以把数据放进去。\n\n比如 `int age = 10;` 就是创建了一个叫 age 的盒子，里面放了数字 10。' },
      ]),
      duration: 12,
    },
  })
  console.log('✅ 课时:', lesson1.title, lesson2.title, lesson3.title)

  // 8. 创建演示题目
  const problem = await prisma.problem.upsert({
    where: { id: 'gesp1-001' },
    update: {},
    create: {
      id: 'gesp1-001',
      tenantId: tenant.id,
      title: 'Hello World',
      description: '<p>请编写程序输出 <code>Hello, World!</code></p>',
      inputDesc: '无',
      outputDesc: '输出 Hello, World!',
      sampleInput: '',
      sampleOutput: 'Hello, World!',
      sampleExplanation: '直接输出指定字符串',
      starterCode: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
      difficulty: 'easy',
      tags: '输出,字符串',
      gespLevel: 1,
      timeLimit: 1000,
      memoryLimit: 128,
    },
  })
  console.log('✅ 题目:', problem.title)

  // 9. 先清理旧测试用例，再创建（避免重复运行 seed 时数据堆积）
  await prisma.testCase.deleteMany({ where: { problemId: problem.id } })
  await prisma.testCase.create({
    data: {
      problemId: problem.id,
      input: '',
      expectedOutput: 'Hello, World!',
      isHidden: false,
      score: 50,
      sortOrder: 1,
    },
  })
  await prisma.testCase.create({
    data: {
      problemId: problem.id,
      input: '',
      expectedOutput: 'Hello, World!',
      isHidden: true,
      score: 50,
      sortOrder: 2,
    },
  })
  console.log('✅ 测试用例: 2 个')

  // 10. 创建徽章
  const achievements = [
    { code: 'first_ac', name: '启程', description: '完成第一节课', icon: '🚀', condition: JSON.stringify({ type: 'complete_lesson', count: 1 }) },
    { code: 'streak_3', name: '坚持', description: '连续学习3天', icon: '🔥', condition: JSON.stringify({ type: 'streak', days: 3 }) },
    { code: 'streak_7', name: '毅力', description: '连续学习7天', icon: '💪', condition: JSON.stringify({ type: 'streak', days: 7 }) },
    { code: 'first_problem', name: '首 AC', description: '首次通过编程题', icon: '✅', condition: JSON.stringify({ type: 'ac_problem', count: 1 }) },
    { code: 'loop_master', name: '循环大师', description: '掌握循环结构', icon: '🔄', condition: JSON.stringify({ type: 'complete_tag', tag: '循环' }) },
    { code: 'array_master', name: '数组达人', description: '掌握数组', icon: '📊', condition: JSON.stringify({ type: 'complete_tag', tag: '数组' }) },
  ]
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: {},
      create: ach,
    })
  }
  console.log('✅ 徽章: 6 个')

  console.log('\n🎉 Seed 数据完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
