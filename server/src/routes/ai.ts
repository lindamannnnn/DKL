import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { authMiddleware } from '../middleware/auth'
import { tenantMiddleware } from '../middleware/tenant'
import axios from 'axios'
import { generateAIFeedback } from '../services/aiFeedbackService'
import { findKnowledgeAnswer } from '../services/aiKnowledgeBase'

const router = Router()
router.use(authMiddleware)
router.use(tenantMiddleware)

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

// AI 老师系统提示词（聊天场景）
const CHAT_SYSTEM_PROMPT = `你是 DKL 学习平台的 AI 老师，专门陪小学 4-6 年级学生学 C++。

【身份】
- 耐心、风趣、会鼓励的编程老师
- 严谨的 C++ 老师：会就是会，不确定就承认，绝不说错
- 学生的朋友和学习伙伴
- 引导者，不是答案机

【必须遵守的规则】
1. 【只引导，不给答案】学生问"答案是什么""帮我写代码"时，用提问或比喻引导他自己想，不能直接写出完整代码或答案。
2. 【只讨论课堂相关内容】如果学生问与 C++、计算机、当前课程无关的问题，温和拒绝并引导回学习。可以说："这个问题超出我的教学范围啦，我是专门教 C++ 的 AI 老师，我们回到程序上吧~"
3. 【绝不超纲】你只能讲解当前课时/题目已经涉及的知识点。如果学生问的问题涉及还没学到的知识点（如数组、函数、指针、循环、结构体等），必须温和拒绝："这个知识点我们还没学到哦，等学到那一课时老师再详细讲。现在我们先专注于当前课件的内容。"
4. 【指出错误，不直接修复】发现错误时，描述现象和原因，让学生自己改。例如："我注意到这里用了中文分号，C++ 只认英文分号哦，像一只小虫子趴在代码里🐛"
5. 【风趣幽默有情感】多用 emoji、比喻、短句。每次回复都要带鼓励的话。
6. 【一次一步】每次只引导学生思考一个点，不要堆太多信息。
7. 【控制长度】每次回复 2-4 句话，最多不超过 5 句。
8. 【即时鼓励】学生每尝试一次、每答对一点，都要及时表扬。

【事实准确性 - 最高优先级】
你讲解的每一个 C++ 知识点都必须是 100% 正确的。如果你不确定，必须说：
"这个问题老师要先确认一下，你可以先看看课件上的相关部分，或者问一下真人老师。"

以下是你必须严格按此描述讲解的核心知识点：
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
- 禁止编造不存在的语法规则
- 禁止写出完整代码或完整行答案
- 禁止在回答中给出完整可运行的代码示例（如不能同时写出声明变量和 cin 的完整组合）
- 禁止讲解当前课时/题目范围外的知识点
- 禁止用"可能""大概""应该""也许是"等模糊词掩盖不确定
- 禁止在不确定时硬给解释
- 禁止一次性给学生列多个步骤清单

【Few-shot 示例】
学生：cin 后面用什么符号？
正确回答：cin 后面用 >>，像小箭头指向变量，表示数据"流进"变量里。👂
错误回答：cin 用 << 读取输入。

学生：cout 后面用什么符号？
正确回答：cout 后面用 <<，像小箭头从变量指向屏幕，表示数据"流出"到屏幕。📢

学生：这道题怎么做？
正确回答：我们先看题目要你输入什么、输出什么。你能用一句话说说题目的意思吗？🤔
错误回答：这道题应该这样写……

可用的小比喻：
- 变量 = 小盒子
- cout = 小喇叭 📢
- cin = 小耳朵 👂
- CPU = 大脑 🧠
- bug = 小虫子 🐛
- 程序 = 搭积木

记住：你是严谨的 C++ 老师。不确定就承认，但说出口的知识必须是正确的。`



// 无 API Key 时的 fallback 回复
const FALLBACK_REPLY = '🔧 AI 老师暂时离线中~\n\n你可以先尝试：\n1. 仔细阅读题目中的示例输入输出\n2. 检查代码是否有中文标点（如中文分号、引号）\n3. 确认变量名拼写正确\n\n加油，你离正确答案已经很近了！💪'

// AI 对话
router.post('/chat', async (req: any, res) => {
  try {
    const userId = req.user.id
    const { message, lessonId, problemId } = req.body

    if (!message) return res.status(400).json({ error: '消息不能为空' })

    // 先查知识库，确保常见语法问题 100% 准确回答
    const kbAnswer = findKnowledgeAnswer(message)
    if (kbAnswer) {
      // 保存对话
      await prisma.aIConversation.create({
        data: { userId, lessonId, problemId, role: 'user', content: message },
      })
      await prisma.aIConversation.create({
        data: { userId, lessonId, problemId, role: 'assistant', content: kbAnswer },
      })
      return res.json({ reply: kbAnswer })
    }

    // 获取近期对话历史（最近 10 条）
    const history = await prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // 构建系统提示
    let systemPrompt = CHAT_SYSTEM_PROMPT

    // 如果有课时上下文，注入（用于限制不超纲）
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
      if (lesson) {
        systemPrompt += `\n\n【当前课时】学生正在学习「${lesson.title}」。你只允许讲解该课时已经涉及的知识点，不要涉及后续课程内容（如数组、函数、指针、循环、结构体等，除非本课时已教）。`
      }
    }

    // 如果有题目上下文，注入
    if (problemId) {
      const problem = await prisma.problem.findFirst({
        where: { id: problemId, tenantId: req.tenantId },
      })
      if (problem) {
        systemPrompt += `\n\n【当前题目】学生正在做题「${problem.title}」。请结合题目内容回答，只讨论与这道题解题思路相关的内容，不要引入超纲知识点。`
      }
    }

    // 构建消息
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.reverse().map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ]

    let reply: string

    if (!AI_API_KEY) {
      // 无 API Key，返回 fallback
      reply = FALLBACK_REPLY
    } else {
      // 调用 AI API
      const aiRes = await axios.post(
        `${AI_BASE_URL}/chat/completions`,
        {
          model: process.env.AI_CHAT_MODEL || 'moonshot-v1-8k',
          messages,
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: { Authorization: `Bearer ${AI_API_KEY}` },
          timeout: 15000,
        }
      )
      reply = aiRes.data.choices[0].message.content
    }

    // 保存对话
    await prisma.aIConversation.create({
      data: { userId, lessonId, problemId, role: 'user', content: message },
    })
    await prisma.aIConversation.create({
      data: { userId, lessonId, problemId, role: 'assistant', content: reply },
    })

    res.json({ reply })
  } catch (err: any) {
    console.error('AI chat error:', err.message)
    res.status(500).json({ error: 'AI 对话失败', detail: err.message })
  }
})

// AI 代码点评
router.post('/feedback', async (req: any, res) => {
  try {
    const { code, problemId } = req.body

    const problem = await prisma.problem.findFirst({
      where: { id: problemId, tenantId: req.tenantId },
    })

    if (!AI_API_KEY) {
      return res.json({
        feedback: '🔧 AI 老师暂时离线中，没法点评代码，但你已经很棒了！\n\n可以对照下面的小清单自查一下：\n1. 有没有写 #include <iostream> 和 using namespace std;？\n2. 变量是不是先声明再使用？\n3. 输入输出的格式和题目要求一致吗？\n4. 有没有混用中文标点？\n\n找到 bug 也是进步！继续加油 🌟',
      })
    }

    const feedback = await generateAIFeedback({
      problemTitle: problem?.title || '未知题目',
      code,
      result: 'wrong_answer',
    })

    res.json({ feedback: feedback || '🔧 AI 老师暂时没法点评，但你已经很棒了！再检查一下输入输出格式和边界情况，继续加油！💪' })
  } catch (err: any) {
    res.status(500).json({ error: 'AI 点评失败', detail: err.message })
  }
})

export default router
