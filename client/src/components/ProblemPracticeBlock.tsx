import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Send, Lightbulb } from 'lucide-react'
import client from '../api/client'
import ProblemStatement from './ProblemStatement'

interface ProblemData {
  id: string
  title: string
  description: string
  inputDesc: string | null
  outputDesc: string | null
  sampleInput: string | null
  sampleOutput: string | null
  sampleExplanation: string | null
  starterCode: string | null
  timeLimit: number
  memoryLimit: number
}

interface TestResult {
  testCase: number
  status: string
  timeUsed: number
  memoryUsed: number
}

const defaultTemplate = `#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}`

interface Props {
  problemIds: string[]
  lessonId: string
}

export default function ProblemPracticeBlock({ problemIds, lessonId }: Props) {
  const [problems, setProblems] = useState<ProblemData[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    loadProblems()
  }, [problemIds.join(',')])

  const loadProblems = async () => {
    setPageLoading(true)
    try {
      const list: ProblemData[] = []
      for (const id of problemIds) {
        const res: any = await client.get(`/problems/${id}`)
        list.push(res)
      }
      setProblems(list)
      const initialCodes: Record<string, string> = {}
      for (const p of list) {
        initialCodes[p.id] = p.starterCode || defaultTemplate
      }
      setCodes(initialCodes)
    } catch (err) {
      console.error('加载题目失败:', err)
    } finally {
      setPageLoading(false)
    }
  }

  const activeProblem = problems[activeIndex]

  const handleCodeChange = (value: string | undefined) => {
    if (!activeProblem) return
    setCodes((prev) => ({ ...prev, [activeProblem.id]: value || '' }))
  }

  const handleSubmit = async () => {
    if (!activeProblem) return
    const problemId = activeProblem.id
    setLoading((prev) => ({ ...prev, [problemId]: true }))
    setResults((prev) => ({ ...prev, [problemId]: { status: 'running', message: '正在评测...' } }))

    try {
      const res: any = await client.post('/submissions', {
        problemId,
        code: codes[problemId] || '',
        language: 'cpp',
        lessonId,
      })
      setResults((prev) => ({
        ...prev,
        [problemId]: { status: 'done', submission: res.submission, details: res.details },
      }))
    } catch (err: any) {
      setResults((prev) => ({ ...prev, [problemId]: { status: 'error', message: err.message } }))
    } finally {
      setLoading((prev) => ({ ...prev, [problemId]: false }))
    }
  }

  const tagLetter = (index: number) => String.fromCharCode(65 + index)

  if (pageLoading) {
    return <div className="text-center py-20 text-gray-500">加载题目中...</div>
  }

  if (problems.length === 0) {
    return <div className="text-center py-20 text-gray-500">暂无练习题</div>
  }

  const currentResult = activeProblem ? results[activeProblem.id] : null

  return (
    <div className="space-y-6">
      {/* Dev-C++ 提示 */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-blue-800">
        <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          小提示：请在 Dev-C++ 中完成程序编写，确认能运行后，再把代码复制到提交测评中递交。
        </p>
      </div>

      {/* 题目标签 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {problems.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActiveIndex(idx)}
            className={`flex-shrink-0 w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
              idx === activeIndex
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={p.title}
          >
            {tagLetter(idx)}
          </button>
        ))}
      </div>

      {/* 题目详情 */}
      <ProblemStatement
        title={activeProblem.title}
        description={activeProblem.description}
        inputDesc={activeProblem.inputDesc}
        outputDesc={activeProblem.outputDesc}
        sampleInput={activeProblem.sampleInput}
        sampleOutput={activeProblem.sampleOutput}
        sampleExplanation={activeProblem.sampleExplanation}
      />

      {/* 递交评测 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="font-bold text-gray-700">递交评测</span>
          <span className="text-xs text-gray-400">语言：C++</span>
        </div>
        <div className="p-4">
          <Editor
            height="280px"
            defaultLanguage="cpp"
            value={codes[activeProblem.id] || ''}
            onChange={handleCodeChange}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: false,
            }}
            theme="vs"
          />
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={handleSubmit}
            disabled={loading[activeProblem.id]}
            className="inline-flex items-center btn-primary px-6 py-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading[activeProblem.id] ? '评测中...' : '递交'}
          </button>
        </div>
      </div>

      {/* 测试结果 */}
      {currentResult && <ResultPanel result={currentResult} />}
    </div>
  )
}

function ResultPanel({ result }: { result: any }) {
  if (result.status === 'running') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">{result.message}</p>
      </div>
    )
  }

  if (result.status === 'error') {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-2xl">
        <p className="font-medium">评测失败</p>
        <p className="text-sm mt-1">{result.message}</p>
      </div>
    )
  }

  if (result.status === 'done') {
    const sub = result.submission
    const details: TestResult[] = result.details || []
    const isAccepted = sub?.result === 'accepted'

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div
            className={`text-2xl font-bold ${
              isAccepted ? 'text-green-600' : sub?.result === 'compile_error' ? 'text-amber-600' : 'text-red-600'
            }`}
          >
            {isAccepted
              ? '✅ 全部通过'
              : sub?.result === 'compile_error'
              ? '❌ 编译出错'
              : `⚠️ 部分通过 (${sub.passedCount}/${sub.totalCount})`}
          </div>
          <div className="text-sm text-gray-500">
            得分: {Math.round((sub.passedCount / (sub.totalCount || 1)) * 100)} | 用时: {sub.timeUsed}ms | 内存: {formatMemory(sub.memoryUsed)}
          </div>
        </div>

        {details.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">测试点信息</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {details.map((r) => {
                const passed = r.status === 'Accepted'
                return (
                  <div
                    key={r.testCase}
                    className={`rounded-lg p-3 text-white ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    <div className="text-xs opacity-90">#{r.testCase}</div>
                    <div className="text-xl font-bold my-1">{passed ? 'AC' : statusShort(r.status)}</div>
                    <div className="text-xs opacity-90">
                      {r.timeUsed}ms / {formatMemory(r.memoryUsed)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {sub?.compileError && (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <p className="text-amber-400 font-medium mb-2">编译错误:</p>
            <pre>{sub.compileError}</pre>
          </div>
        )}

        {sub?.aiFeedback && (
          <div className="bg-primary-50 border border-primary-100 p-4 rounded-lg">
            <p className="text-primary-700 font-medium mb-2 flex items-center gap-2">
              <span>🤖</span> AI 老师说：
            </p>
            <div className="text-primary-800 text-sm whitespace-pre-wrap leading-relaxed">{sub.aiFeedback}</div>
          </div>
        )}
      </div>
    )
  }

  return null
}

function statusShort(status: string) {
  const map: Record<string, string> = {
    'Wrong Answer': 'WA',
    'Time Limit Exceeded': 'TLE',
    'Memory Limit Exceeded': 'MLE',
    'Runtime Error': 'RE',
    'Compilation Error': 'CE',
    'Presentation Error': 'PE',
  }
  return map[status] || status.slice(0, 3).toUpperCase()
}

function formatMemory(mb: number) {
  return `${mb}MB`
}
