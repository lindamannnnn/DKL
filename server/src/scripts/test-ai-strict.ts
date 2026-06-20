/**
 * 测试严格版 AI 教师提示词
 * 重点验证：事实准确性、不说反操作符、不直接给代码
 */

import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const { generateAIFeedback } = await import('../services/aiFeedbackService')

  const testCases = [
    {
      name: 'cin 操作符方向错误',
      code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin << a << b;
    cout << a + b;
    return 0;
}`,
      result: 'compile_error' as const,
      compileError: `error: no match for 'operator<<' (operand types are 'std::istream' and 'int')`,
      ruleFeedback: 'cin 读取输入应该使用 >> 操作符，而不是 <<。<< 是 cout 输出时使用的。',
    },
    {
      name: '答案错误',
      code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a - b;
    return 0;
}`,
      result: 'wrong_answer' as const,
    },
    {
      name: '完全正确',
      code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`,
      result: 'accepted' as const,
      passedCount: 3,
      totalCount: 3,
    },
  ]

  for (const tc of testCases) {
    console.log(`\n========== ${tc.name} ==========`)
    const feedback = await generateAIFeedback({
      problemTitle: 'A+B 问题',
      code: tc.code,
      result: tc.result,
      compileError: tc.compileError,
      passedCount: tc.passedCount,
      totalCount: tc.totalCount,
      ruleFeedback: tc.ruleFeedback,
    })

    if (feedback) {
      console.log('✅ 生成反馈：')
      console.log(feedback)

      // 简单的事实正确性检查
      const lower = feedback.toLowerCase()
      if (lower.includes('cin 用 <<') || lower.includes('cin<<') || lower.includes('cin 使用 <<')) {
        console.log('⚠️ 警告：可能把 cin 操作符说反了')
      }
      if (feedback.includes('cin >> a >> b')) {
        console.log('⚠️ 警告：可能直接给出了完整代码行')
      }
    } else {
      console.log('❌ 生成反馈失败')
    }
  }
}

main().catch(console.error)
