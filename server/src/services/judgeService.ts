import axios from 'axios'
import crypto from 'crypto'

const JUDGE_SERVER_URL = process.env.JUDGE_SERVER_URL || 'http://localhost:8080'
const JUDGE_SERVER_TOKEN = crypto.createHash('sha256').update(process.env.JUDGE_SERVER_TOKEN || 'dkl_judge_token_change_me').digest('hex')

export interface JudgeTask {
  src: string
  language: string
  testCases: {
    input: string
    expectedOutput: string
    score?: number // IOI 部分分制用
  }[]
  timeLimit?: number // ms
  memoryLimit?: number // MB
}

export interface JudgeResult {
  passed: boolean
  score: number
  totalScore: number
  results: {
    testCase: number
    status: string // Accepted, Wrong Answer, Time Limit Exceeded, etc.
    timeUsed: number
    memoryUsed: number
    output?: string
    error?: string
  }[]
  compileError?: string
}

// JudgeServer result constants
const RESULT_SUCCESS = 0
const RESULT_WRONG_ANSWER = -1
const RESULT_CPU_TIME_LIMIT_EXCEEDED = 1
const RESULT_REAL_TIME_LIMIT_EXCEEDED = 2
const RESULT_MEMORY_LIMIT_EXCEEDED = 3
const RESULT_RUNTIME_ERROR = 4
const RESULT_SYSTEM_ERROR = 5

function resultToStatus(result: number): string {
  switch (result) {
    case RESULT_SUCCESS: return 'Accepted'
    case RESULT_WRONG_ANSWER: return 'Wrong Answer'
    case RESULT_CPU_TIME_LIMIT_EXCEEDED: return 'Time Limit Exceeded'
    case RESULT_REAL_TIME_LIMIT_EXCEEDED: return 'Time Limit Exceeded'
    case RESULT_MEMORY_LIMIT_EXCEEDED: return 'Memory Limit Exceeded'
    case RESULT_RUNTIME_ERROR: return 'Runtime Error'
    case RESULT_SYSTEM_ERROR: return 'System Error'
    default: return 'Unknown'
  }
}

function getLanguageConfig(language: string) {
  const lang = language.toLowerCase()
  if (lang === 'c++' || lang === 'cpp') {
    return {
      compile: {
        src_name: 'main.cpp',
        exe_name: 'main',
        max_cpu_time: 3000,
        max_real_time: 10000,
        max_memory: 268435456,
        compile_command: '/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -o {exe_path}',
        env: ['PATH=/usr/bin']
      },
      run: {
        command: '{exe_path}',
        seccomp_rule: 'c_cpp',
        env: ['PATH=/usr/bin'],
        memory_limit_check_only: 1
      }
    }
  }
  throw new Error(`不支持的语言: ${language}`)
}

/**
 * 调用 JudgeServer 评测代码
 */
export async function judgeCode(task: JudgeTask): Promise<JudgeResult> {
  const languageConfig = getLanguageConfig(task.language)
  const testCase = task.testCases.map(tc => ({
    input: tc.input,
    output: tc.expectedOutput,
  }))

  const body: any = {
    language_config: languageConfig,
    src: task.src,
    max_cpu_time: task.timeLimit || 1000,
    max_memory: (task.memoryLimit || 128) * 1024 * 1024,
    test_case: testCase,
  }

  try {
    const response = await axios.post(`${JUDGE_SERVER_URL}/judge`, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Judge-Server-Token': JUDGE_SERVER_TOKEN,
      },
      timeout: 30000,
    })

    const data = response.data

    // 编译错误
    if (data.err === 'CompileError') {
      return {
        passed: false,
        score: 0,
        totalScore: task.testCases.length,
        results: [],
        compileError: data.data,
      }
    }

    if (data.err) {
      throw new Error(`JudgeServer error: ${data.err} - ${data.data}`)
    }

    const results = data.data || []
    const parsedResults = results.map((r: any, index: number) => ({
      testCase: index + 1,
      status: resultToStatus(r.result),
      timeUsed: r.cpu_time || 0,
      memoryUsed: Math.round((r.memory || 0) / 1024 / 1024), // bytes -> MB
      output: r.output,
      error: r.error,
    }))

    const passedCount = parsedResults.filter((r: any) => r.status === 'Accepted').length

    return {
      passed: passedCount === task.testCases.length,
      score: passedCount,
      totalScore: task.testCases.length,
      results: parsedResults,
    }
  } catch (error: any) {
    console.error('JudgeServer error:', error.message)
    if (error.response?.data) {
      console.error('JudgeServer response:', error.response.data)
    }
    throw new Error(`评测服务调用失败: ${error.message}`)
  }
}

/**
 * 逐个测试点评测（实现 IOI 部分分制）
 */
export async function judgeCodeWithPartialScore(task: JudgeTask): Promise<JudgeResult> {
  const languageConfig = getLanguageConfig(task.language)
  const testCase = task.testCases.map(tc => ({
    input: tc.input,
    output: tc.expectedOutput,
  }))

  const body: any = {
    language_config: languageConfig,
    src: task.src,
    max_cpu_time: task.timeLimit || 1000,
    max_memory: (task.memoryLimit || 128) * 1024 * 1024,
    test_case: testCase,
    output: true, // 返回每个测试点的输出
  }

  try {
    const response = await axios.post(`${JUDGE_SERVER_URL}/judge`, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Judge-Server-Token': JUDGE_SERVER_TOKEN,
      },
      timeout: 30000,
    })

    const data = response.data

    if (data.err === 'CompileError') {
      return {
        passed: false,
        score: 0,
        totalScore: task.testCases.reduce((sum, tc) => sum + (tc.score || 0), 0),
        results: [],
        compileError: data.data,
      }
    }

    if (data.err) {
      throw new Error(`JudgeServer error: ${data.err} - ${data.data}`)
    }

    const results = data.data || []
    let totalScore = 0
    const totalPossibleScore = task.testCases.reduce((sum, tc) => sum + (tc.score || 0), 0)

    const parsedResults = results.map((r: any, index: number) => {
      const passed = r.result === RESULT_SUCCESS
      if (passed) {
        totalScore += task.testCases[index]?.score || 0
      }
      return {
        testCase: index + 1,
        status: resultToStatus(r.result),
        timeUsed: r.cpu_time || 0,
        memoryUsed: Math.round((r.memory || 0) / 1024 / 1024),
        output: r.output,
        error: r.error,
      }
    })

    return {
      passed: totalScore === totalPossibleScore,
      score: totalScore,
      totalScore: totalPossibleScore,
      results: parsedResults,
    }
  } catch (error: any) {
    console.error('JudgeServer error:', error.message)
    throw new Error(`评测服务调用失败: ${error.message}`)
  }
}
