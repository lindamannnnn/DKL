/**
 * 测试 Kimi (Moonshot) API 可用性
 * 运行：npx tsx src/scripts/test-kimi-api.ts
 */

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.KIMI_API_KEY
const BASE_URL = process.env.KIMI_BASE_URL || 'https://api.moonshot.cn/v1'
const MODEL = process.env.AI_CHAT_MODEL || 'moonshot-v1-8k'

async function testModels() {
  console.log('=== 1. 测试模型列表 ===')
  console.log('API_KEY:', API_KEY ? `${API_KEY.slice(0, 12)}...${API_KEY.slice(-4)}` : '未设置')
  console.log('BASE_URL:', BASE_URL)

  try {
    const res = await axios.get(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      timeout: 15000,
    })
    console.log('✅ 获取模型列表成功')
    console.log('可用模型数:', res.data.data?.length || 0)
    console.log(
      '模型ID列表:',
      res.data.data?.map((m: any) => m.id).join(', ')
    )
    return true
  } catch (err: any) {
    console.log('❌ 获取模型列表失败')
    console.log('状态码:', err.response?.status)
    console.log('错误信息:', err.response?.data?.error?.message || err.message)
    return false
  }
}

async function testChat() {
  console.log('\n=== 2. 测试 Chat Completions ===')
  console.log('使用模型:', MODEL)

  const systemPrompt = `你是 DKL 学习平台的 AI 老师，专门教小学 4-6 年级学生 C++ 编程。只给思路，绝不直接给答案。语气风趣幽默，多用 emoji。每次回复不超过 3 句话。`

  try {
    const start = Date.now()
    const res = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: '老师，这道题怎么做？要输入两个整数，输出它们的和。' },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
        timeout: 30000,
      }
    )
    const cost = Date.now() - start

    console.log('✅ Chat 接口调用成功')
    console.log('耗时:', cost, 'ms')
    console.log('模型:', res.data.model)
    console.log('usage:', JSON.stringify(res.data.usage))
    console.log('回复内容:')
    console.log(res.data.choices[0].message.content)
    return true
  } catch (err: any) {
    console.log('❌ Chat 接口调用失败')
    console.log('状态码:', err.response?.status)
    console.log('错误信息:', err.response?.data?.error?.message || err.message)
    if (err.response?.data) {
      console.log('完整错误:', JSON.stringify(err.response.data, null, 2))
    }
    return false
  }
}

async function testFeedback() {
  console.log('\n=== 3. 测试代码点评 ===')

  const systemPrompt = `你是 DKL 学习平台的 AI 老师，正在点评一位小学 4-6 年级学生的 C++ 代码。不能直接给出修改后的完整代码。先看优点，再指出问题，然后给出引导思考，最后鼓励。总长度 3-5 句话。`

  const code = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin << a << b;
    cout << a + b;
    return 0;
}`

  const userPrompt = `题目：A+B 问题\n代码：\n\`\`\`cpp\n${code}\n\`\`\`\n评测结果：compile_error\n编译错误信息：error: no match for 'operator<<' (operand types are 'std::istream' {aka 'std::basic_istream<char>'} and 'int')\n\n请按系统提示词的要求给出引导式点评。`

  try {
    const start = Date.now()
    const res = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.6,
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
        timeout: 30000,
      }
    )
    const cost = Date.now() - start

    console.log('✅ 代码点评接口调用成功')
    console.log('耗时:', cost, 'ms')
    console.log('模型:', res.data.model)
    console.log('usage:', JSON.stringify(res.data.usage))
    console.log('点评内容:')
    console.log(res.data.choices[0].message.content)
    return true
  } catch (err: any) {
    console.log('❌ 代码点评接口调用失败')
    console.log('状态码:', err.response?.status)
    console.log('错误信息:', err.response?.data?.error?.message || err.message)
    if (err.response?.data) {
      console.log('完整错误:', JSON.stringify(err.response.data, null, 2))
    }
    return false
  }
}

async function main() {
  if (!API_KEY) {
    console.log('❌ KIMI_API_KEY 未设置')
    process.exit(1)
  }

  const ok1 = await testModels()
  const ok2 = await testChat()
  const ok3 = await testFeedback()

  console.log('\n=== 测试结果汇总 ===')
  console.log('模型列表:', ok1 ? '✅ 通过' : '❌ 失败')
  console.log('聊天接口:', ok2 ? '✅ 通过' : '❌ 失败')
  console.log('点评接口:', ok3 ? '✅ 通过' : '❌ 失败')

  if (ok1 && ok2 && ok3) {
    console.log('\n🎉 Kimi API 测试全部通过！')
    process.exit(0)
  } else {
    console.log('\n⚠️ 部分测试未通过')
    process.exit(1)
  }
}

main()
