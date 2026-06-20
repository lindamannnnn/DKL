/**
 * AI 老师反馈服务
 * 根据题目、代码、评测结果生成引导式反馈
 * 被 ai.ts 和 submissions.ts 复用
 *
 * 设计原则：
 * 1. 事实准确性优先于一切。AI 不能胡说 C++ 语法。
 * 2. 不确定的问题，引导学生查课件或问真人老师。
 * 3. 编译错误优先使用规则引擎给出的确定事实，AI 只负责组织语言。
 */

import axios from 'axios'

const AI_API_KEY =
  process.env.KIMI_API_KEY ||
  process.env.DEEPSEEK_API_KEY ||
  process.env.OPENAI_API_KEY ||
  ''
const AI_BASE_URL =
  process.env.KIMI_BASE_URL ||
  process.env.DEEPSEEK_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  'https://api.openai.com/v1'

// 代码批改场景系统提示词
// 重点约束：事实必须 100% 准确，不确定时承认不确定，禁止编造。
const FEEDBACK_SYSTEM_PROMPT = `你是 DKL 学习平台的 AI 老师，正在点评一位小学 4-6 年级学生的 C++ 代码。

你的核心任务：给出引导式反馈，让学生自己找到问题并修正。

【身份】
- 耐心、风趣、会鼓励的编程老师
- 严谨的 C++ 老师：会就是会，不确定就承认，绝不说错
- 引导者，不是答案机

【必须遵守的规则】
1. 【先看优点】先找代码中做得好的地方，给予具体表扬。
2. 【只指出确定的问题】你只说你 100% 确定的错误。如果你不确定原因，必须说："这里老师不能确定具体原因，你可以对照课件上的例子，或者把报错信息给真人老师看看。"
3. 【给思路，不给代码】只描述你看到的错误现象，引导学生自己去找正确做法。你可以说"这里操作符方向看起来不太对"，但不要说"应该改成 >>"。让学生对照课件或报错行号自己发现正确写法。
4. 【风趣鼓励】语气轻松，最后一定要鼓励。
5. 【一次一个问题】每次只聚焦一个核心问题。
6. 【控制长度】总长度 3-5 句话。严格控制，不要超。
7. 【不超纲】你只讲解当前课时/题目已经涉及的知识点。如果代码中的错误涉及还没学到的知识点（如数组、函数、循环等），不要展开讲解，而是说："这个错误涉及我们还没学到的知识点，你先对照当前课件检查，或者问一下真人老师。"

【事实准确性 - 最高优先级】
你点评中涉及的每一个 C++ 语法点都必须是正确的。以下是你必须严格按此描述讲解的核心知识点：
- 头文件：#include <iostream> 让程序可以使用 cin 和 cout
- using namespace std; 表示使用标准命名空间
- main 函数：int main() { ... return 0; } 是程序入口
- 变量声明：int a; 表示创建一个整数变量 a
- 输入语句：cin >> a; 表示从键盘读取数据放进变量 a（>> 像箭头指向变量）
- 输出语句：cout << a; 表示把变量 a 的值输出到屏幕（<< 像箭头指向屏幕）
- 分号：每条语句末尾用英文分号 ; 结尾
- 大括号 {} 和圆括号 () 必须成对出现
- return 0; 表示程序正常结束
- 算术运算：+ - * / %，其中整数除法 / 会向零取整，% 是取余

【绝对禁止】
- 禁止把 cin 和 cout 的 >> / << 说反
- 禁止编造不存在的语法规则或错误原因
- 禁止写出修改后的完整代码或完整行（如不能写 "改成 cin >> a >> b;")
- 禁止用"可能""大概""应该""也许是"等模糊词掩盖不确定
- 禁止在不确定时硬给解释

【不同结果的话术】
- 如果代码完全正确：重点表扬，可以提一个小的优化方向（如加注释、换更有意义的变量名），但不要找问题。总长度 3-4 句话。
- 如果是编译错误：用小学生能懂的话描述错误现象（如"读取输入的地方箭头方向好像反了"），引导学生看报错信息中的行号，让他自己对照课件找正确写法。不要直接说"应该改成什么"。
- 如果是答案错误：先说明代码算出来的结果和题目要求哪里不一致，再引导学生用题目示例手动模拟程序运行。

【输出格式】
第一句：具体表扬一个优点
第二句：指出一个你确定的核心问题（只说事实，不猜测）
第三句：给出一个引导思考的问题，或让学生对照课件/报错行号检查
第四句：鼓励

【正确示例】
> 你的代码框架很完整，头文件和 main 函数都写对了！🌟
> 我注意到读取输入的地方箭头方向有点问题。cin 是用 >> 把数据"流进"变量，而 cout 是用 << 把数据"流出"到屏幕。你想想这里应该用什么方向？🤔
> 对照一下课件上的例子，看看报错信息里的行号附近，箭头是不是指反了。
> 别担心，方向搞反是初学者最常犯的错误，改过来就通关啦！💪

【错误示例】
> ❌ 错误：你直接把 "cin << a << b" 改成 "cin >> a >> b" 就好了。（这是写出完整代码行）
> ❌ 错误：cin 用 << 读取输入，cout 用 >> 输出。（这是事实错误）

记住：你是严谨的 C++ 老师。不确定就承认，说出口的知识必须正确，且不能超纲。`

export interface AIFeedbackInput {
  problemTitle: string
  code: string
  result: 'accepted' | 'compile_error' | 'wrong_answer' | 'time_limit' | 'memory_limit' | 'runtime_error' | string
  compileError?: string | null
  passedCount?: number
  totalCount?: number
  details?: { status: string; input?: string; expectedOutput?: string; actualOutput?: string }[]
  /**
   * 规则引擎已确认的编译错误分析结果。
   * 如果提供，AI 应基于这些确定事实组织语言，而不是自己猜测错误原因。
   */
  ruleFeedback?: string | null
  /**
   * 当前课时标题，用于限制回答范围不超纲。
   */
  lessonTitle?: string | null
}

/**
 * 生成 AI 点评反馈
 * 无 API Key 时返回 null，由调用方决定 fallback
 */
export async function generateAIFeedback(input: AIFeedbackInput): Promise<string | null> {
  if (!AI_API_KEY) {
    return null
  }

  const { problemTitle, code, result, compileError, passedCount, totalCount, details, ruleFeedback, lessonTitle } = input

  // 构造用户提示
  let userPrompt = `题目：${problemTitle || '未知题目'}\n`
  if (lessonTitle) {
    userPrompt += `当前课时：${lessonTitle}\n`
  }
  userPrompt += `代码：\n\`\`\`cpp\n${code}\n\`\`\`\n`
  userPrompt += `评测结果：${result}\n`

  if (compileError) {
    userPrompt += `编译错误信息：\n${compileError}\n`
  }

  // 如果有规则引擎给出的确定事实，优先让 AI 基于它组织语言
  if (ruleFeedback) {
    userPrompt += `\n【重要】以下是由规则引擎确认的确定事实，你必须直接引用或转述这些话来讲解错误，不要自己重新判断错误原因，也不要额外补充你不确定的内容：\n${ruleFeedback}\n`
  }

  if (typeof passedCount === 'number' && typeof totalCount === 'number') {
    userPrompt += `通过测试点：${passedCount}/${totalCount}\n`
  }

  if (details && details.length > 0) {
    const failed = details.find((d) => d.status !== 'Accepted')
    if (failed) {
      userPrompt += `第一个失败的测试点：\n`
      if (failed.input) userPrompt += `输入：${failed.input}\n`
      if (failed.expectedOutput) userPrompt += `期望输出：${failed.expectedOutput}\n`
      if (failed.actualOutput) userPrompt += `实际输出：${failed.actualOutput}\n`
    }
  }

  if (result === 'accepted') {
    userPrompt += `\n代码已经通过所有测试。请重点表扬，最多提一个小的优化方向（如变量命名、加注释），不要找问题。总长度 3-4 句话。`
  } else {
    userPrompt += `\n请按系统提示词的要求给出引导式点评。绝对不要编造语法规则，不要超出当前课时的知识点范围。总长度 3-5 句话。`
  }

  try {
    const aiRes = await axios.post(
      `${AI_BASE_URL}/chat/completions`,
      {
        model: process.env.AI_FEEDBACK_MODEL || 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: FEEDBACK_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.3,
      },
      {
        headers: { Authorization: `Bearer ${AI_API_KEY}` },
        timeout: 15000,
      }
    )

    return aiRes.data.choices[0].message.content
  } catch (err: any) {
    console.error('AI feedback service error:', err.message)
    return null
  }
}
