/**
 * 编译错误规则引擎
 * 针对小学生常见错误，预设匹配规则，不依赖 AI
 */

export interface ErrorRule {
  pattern: RegExp
  message: string // 给小学生看的白话解释
  hint?: string // 修复建议
}

const rules: ErrorRule[] = [
  // 中文标点
  {
    pattern: /error:.*stray.*\xe3\x80\x82|stray.*'\\xef\\xbc\\x8c'|stray.*'\\xef\\xbc\\x9b'/i,
    message: '你用了中文标点！代码里要用英文的分号 ; 和逗号 , 哦',
    hint: '把中文的分号「；」改成英文的「;」',
  },
  {
    pattern: /stray.*'\\xe3\\x80\\x82'|stray.*'\\xef\\xbc\\x8c'/i,
    message: '检测到了中文标点符号！代码里只能用英文标点',
    hint: '检查是否有中文的逗号、句号、分号、括号',
  },

  // 缺少分号
  {
    pattern: /error: expected ';' before/i,
    message: '某一行末尾忘了加分号 ; ，就像一句话忘了句号',
    hint: '在报错的那一行末尾加上英文分号 ;',
  },

  // 变量未声明
  {
    pattern: /error: '.*' was not declared in this scope/i,
    message: '你用了一个还没「介绍」过的变量，就像叫了一个不认识的名字',
    hint: '在使用变量前，先用 int/double/string 声明它，比如 int x = 10;',
  },

  // 头文件未包含
  {
    pattern: /error: 'cout' was not declared in this scope/i,
    message: '忘记包含头文件了！cout 住在 <iostream> 里',
    hint: '在代码最开头加上 #include <iostream>',
  },
  {
    pattern: /error: 'cin' was not declared in this scope/i,
    message: '忘记包含头文件了！cin 住在 <iostream> 里',
    hint: '在代码最开头加上 #include <iostream>',
  },

  // 拼写错误
  {
    pattern: /error: 'main' must return 'int'/i,
    message: 'main 函数的返回类型写错了，应该是 int',
    hint: '把 mian 改成 main，或者把返回类型改成 int',
  },

  // 缺少 return
  {
    pattern: /warning: control reaches end of non-void function/i,
    message: 'main 函数最后缺少 return 0;',
    hint: '在 main 函数的最后加上 return 0;',
  },

  // 括号不匹配
  {
    pattern: /error: expected '\)' before/i,
    message: '括号可能没配对，少了一个右括号 )',
    hint: '检查一下左右括号是否成对出现',
  },
  {
    pattern: /error: expected '}' before/i,
    message: '大括号可能没配对，少了一个右大括号 }',
    hint: '检查一下左右大括号是否成对出现',
  },

  // 字符串引号不匹配
  {
    pattern: /error: missing terminating " character/i,
    message: '字符串的引号没配对，少了一个双引号 "',
    hint: '检查字符串两边是否都有双引号',
  },

  // 类型不匹配
  {
    pattern: /error: invalid operands of types '.*' and '.*' to binary 'operator\+'/i,
    message: '这两种类型不能直接相加，就像苹果和香蕉不能直接「加」在一起',
    hint: '检查变量的类型是否正确',
  },

  // 数组越界（运行时错误提示）
  {
    pattern: /runtime error.*index out of bounds/i,
    message: '数组越界了！你访问了一个不存在的格子',
    hint: '数组索引从 0 开始，最大索引是 数组大小-1',
  },

  // 除以零
  {
    pattern: /runtime error.*division by zero/i,
    message: '除以零了！数学里不能除以零哦',
    hint: '检查除数是否可能为零',
  },
]

/**
 * 分析编译错误，返回小学生友好的提示
 */
export function analyzeCompileError(errorOutput: string): { message: string; hint?: string } | null {
  for (const rule of rules) {
    if (rule.pattern.test(errorOutput)) {
      return { message: rule.message, hint: rule.hint }
    }
  }

  // 没有匹配到规则，返回通用提示
  return {
    message: '代码有点小问题，看看报错信息里提到的行号，仔细检查一下语法',
    hint: '可以问问 AI 教练具体是哪一行出错了',
  }
}

/**
 * 根据错误类型返回友好提示
 */
export function getFriendlyResult(result: string, passed: number, total: number): string {
  if (result === 'accepted') {
    return '✅ 全部通过！太棒了！'
  }
  if (result === 'compile_error') {
    return '❌ 编译出错，代码里有语法错误'
  }
  if (result === 'wrong_answer') {
    if (passed === 0) {
      return '❌ 答案不对，再仔细看看题目要求？'
    }
    return `⚠️ 部分通过 (${passed}/${total})，还有一些测试点没过，再检查一下边界情况`
  }
  if (result === 'time_limit') {
    return '⏱️ 运行超时，代码太慢了，想想有没有更高效的方法？'
  }
  if (result === 'memory_limit') {
    return '💾 内存超限，是不是用了太多空间？'
  }
  if (result === 'runtime_error') {
    return '💥 运行时错误，可能数组越界或除以零了'
  }
  return '评测完成'
}
