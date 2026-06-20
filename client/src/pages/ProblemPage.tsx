import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { Send, ChevronLeft } from 'lucide-react'
import client from '../api/client'
import ProblemStatement from '../components/ProblemStatement'
import BadgeToast from '../components/BadgeToast'

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

interface LessonProblem {
  id: string
  title: string
  difficulty: string
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

export default function ProblemPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const demoCode = searchParams.get('code')
  const lessonId = searchParams.get('lessonId')

  // 课程练习模式：一个课时多道题目
  const [lessonProblems, setLessonProblems] = useState<LessonProblem[]>([])
  const [activeProblemIndex, setActiveProblemIndex] = useState(0)

  // 当前题目
  const [problem, setProblem] = useState<ProblemData | null>(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [newBadges, setNewBadges] = useState<{ id: string; name: string; icon: string; description: string }[]>([])

  const activeProblemId = lessonProblems[activeProblemIndex]?.id || id

  // 加载课时题目列表（课程练习模式）
  useEffect(() => {
    if (lessonId) {
      loadLessonProblems()
    }
  }, [lessonId])

  const loadLessonProblems = async () => {
    try {
      const res: any = await client.get(`/lessons/${lessonId}/problems`)
      setLessonProblems(res)
      if (res.length > 0 && !id) {
        setActiveProblemIndex(0)
      }
    } catch (err) {
      console.error('加载课时题目失败:', err)
    }
  }

  // 加载当前题目详情
  useEffect(() => {
    const pid = activeProblemId
    if (pid && pid !== 'demo') {
      loadProblem(pid)
    } else {
      setPageLoading(false)
    }
  }, [activeProblemId])

  const loadProblem = async (problemId: string) => {
    setPageLoading(true)
    try {
      const res: any = await client.get(`/problems/${problemId}`)
      setProblem(res)
      setCode(res.starterCode || defaultTemplate)
      setResult(null)
    } catch (err) {
      console.error('加载题目失败:', err)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (demoCode) {
      setCode(decodeURIComponent(demoCode))
    }
  }, [demoCode])

  const handleSubmit = async () => {
    if (!activeProblemId || activeProblemId === 'demo') return
    setLoading(true)
    setResult({ status: 'running', message: '正在评测...' })

    try {
      const res: any = await client.post('/submissions', {
        problemId: activeProblemId,
        code,
        language: 'cpp',
        lessonId,
      })
      setResult({
        status: 'done',
        submission: res.submission,
        details: res.details,
      })
      if (res.newBadges?.length > 0) {
        setNewBadges(res.newBadges)
      }
    } catch (err: any) {
      setResult({ status: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  // 标签字母 A B C D E...
  const tagLetter = (index: number) => String.fromCharCode(65 + index)

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900">
              {lessonId ? '课程练习' : (problem?.title || '代码练习')}
            </h1>
            {problem && (
              <span className="text-xs text-gray-400">
                时间限制: {problem.timeLimit}ms | 内存限制: {problem.memoryLimit}MB
              </span>
            )}
          </div>
        </div>

        {/* 题目标签切换（课程练习模式） */}
        {lessonProblems.length > 0 && (
          <div className="max-w-6xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {lessonProblems.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveProblemIndex(idx)}
                className={`flex-shrink-0 w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  idx === activeProblemIndex
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={p.title}
              >
                {tagLetter(idx)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 题目详情 */}
        {problem ? (
          <ProblemStatement
            title={problem.title}
            description={problem.description}
            inputDesc={problem.inputDesc}
            outputDesc={problem.outputDesc}
            sampleInput={problem.sampleInput}
            sampleOutput={problem.sampleOutput}
            sampleExplanation={problem.sampleExplanation}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            当前暂无练习题
          </div>
        )}

        {/* 代码编辑与提交 */}
        {problem && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">递交评测（C++）</span>
              <span className="text-xs text-gray-400">语言固定为 C++，不支持上传文件</span>
            </div>
            <div className="p-4">
              <Editor
                height="320px"
                defaultLanguage="cpp"
                value={code}
                onChange={(value) => setCode(value || '')}
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
                disabled={loading || activeProblemId === 'demo'}
                className="inline-flex items-center btn-primary px-6 py-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? '评测中...' : '递交'}
              </button>
            </div>
          </div>
        )}

        {/* 测试结果 */}
        {result && <ResultPanel result={result} />}

        {/* 获得徽章通知 */}
        {newBadges.length > 0 && (
          <BadgeToast badges={newBadges} onClose={() => setNewBadges([])} />
        )}
      </div>
    </div>
  )
}

// 结果展示面板
function ResultPanel({ result }: { result: any }) {
  if (result.status === 'running') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
        {/* 总体结果 */}
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
            得分: {sub.score} | 用时: {sub.timeUsed}ms | 内存: {sub.memoryUsed}KB
          </div>
        </div>

        {/* 测试点格子 */}
        {details.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">测试点信息</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {details.map((r) => {
                const passed = r.status === 'Accepted'
                return (
                  <div
                    key={r.testCase}
                    className={`rounded-lg p-3 text-white ${
                      passed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <div className="text-xs opacity-90">#{r.testCase}</div>
                    <div className="text-xl font-bold my-1">
                      {passed ? 'AC' : statusShort(r.status)}
                    </div>
                    <div className="text-xs opacity-90">
                      {r.timeUsed}ms / {formatMemory(r.memoryUsed)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 编译错误 */}
        {sub?.compileError && (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <p className="text-amber-400 font-medium mb-2">编译错误:</p>
            <pre>{sub.compileError}</pre>
          </div>
        )}

        {/* AI 老师反馈 */}
        {sub?.aiFeedback && (
          <div className="bg-primary-50 border border-primary-100 p-4 rounded-lg">
            <p className="text-primary-700 font-medium mb-2 flex items-center gap-2">
              <span>🤖</span> AI 老师说：
            </p>
            <div className="text-primary-800 text-sm whitespace-pre-wrap leading-relaxed">
              {sub.aiFeedback}
            </div>
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

function formatMemory(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(2)}MB`
  return `${kb}KB`
}
