/**
 * AI 教师知识库
 * 用于回答常见 C++ 语法问题，确保事实 100% 准确，不调用 LLM。
 * 匹配到的问题直接返回预设回答；未匹配到的再交给 LLM 处理。
 */

interface KnowledgeItem {
  // 问题关键词，用户消息包含其中任意一个即匹配
  keywords: string[]
  // 标准回答
  answer: string
}

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ['cin 后面', 'cin 用', 'cin 后面用什么', 'cin 用什么符号', 'cin 操作符'],
    answer: 'cin 后面用 `>>`，像小箭头指向变量，表示数据"流进"变量里。👂',
  },
  {
    keywords: ['cout 后面', 'cout 用', 'cout 后面用什么', 'cout 用什么符号', 'cout 操作符'],
    answer: 'cout 后面用 `<<`，像小箭头从变量指向屏幕，表示数据"流出"到屏幕。📢',
  },
  {
    keywords: ['cin 和 cout 区别', 'cin cout 不同', 'cin cout 区别'],
    answer: 'cin 是"小耳朵"，负责用 `>>` 读取输入；cout 是"小喇叭"，负责用 `<<` 输出。方向千万别搞反哦！👂📢',
  },
  {
    keywords: ['分号', '语句末尾', '为什么加分号', ';'],
    answer: 'C++ 里每条语句末尾要加英文分号 `;`，就像一句话末尾要加句号。如果漏了，编译器会"迷路"。🐛',
  },
  {
    keywords: ['头文件', '#include', 'iostream', '为什么加头文件'],
    answer: '`#include <iostream>` 就像打开工具箱，让程序可以使用 cin 和 cout。没有它，这两个功能就用不了。🧰',
  },
  {
    keywords: ['using namespace std', '命名空间'],
    answer: '`using namespace std;` 表示使用标准命名空间。加上它，写 cin、cout 时就不用写 `std::` 前缀了。',
  },
  {
    keywords: ['main 函数', 'int main', 'return 0'],
    answer: '`int main()` 是程序的入口，程序从这里开始执行。最后写 `return 0;` 表示程序正常结束。',
  },
  {
    keywords: ['变量声明', 'int 是什么', '什么是变量', '为什么要声明变量'],
    answer: '变量就像一个小盒子，用来装数据。`int a;` 表示创建一个叫 a 的整数小盒子，用之前必须先声明。📦',
  },
  {
    keywords: ['整数除法', '7/2', '7除以2', '除法小数'],
    answer: 'C++ 里整数除以整数结果还是整数，小数部分会被丢掉。比如 `7 / 2` 结果是 `3`，不是 `3.5`。',
  },
  {
    keywords: ['取余', '%', '取模'],
    answer: '`%` 是取余运算符，表示除法后的余数。比如 `7 % 2` 结果是 `1`，因为 7 除以 2 余 1。',
  },
]

/**
 * 在知识库中查找匹配的回答
 * 返回 null 表示未匹配，需要调用 LLM
 */
export function findKnowledgeAnswer(message: string): string | null {
  const lowerMsg = message.toLowerCase().replace(/\s+/g, '')

  for (const item of knowledgeBase) {
    for (const kw of item.keywords) {
      const normalizedKw = kw.toLowerCase().replace(/\s+/g, '')
      if (lowerMsg.includes(normalizedKw)) {
        return item.answer
      }
    }
  }

  return null
}

/**
 * 添加/更新知识库条目（供后续扩展）
 */
export function addKnowledgeItem(item: KnowledgeItem) {
  knowledgeBase.push(item)
}
