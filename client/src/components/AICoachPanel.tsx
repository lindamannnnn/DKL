import { useState } from 'react'
import { X, Send } from 'lucide-react'
import client from '../api/client'

interface AICoachPanelProps {
  lessonId?: string
  problemId?: string
  onClose: () => void
}

export default function AICoachPanel({ lessonId, problemId, onClose }: AICoachPanelProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '你好呀！我是你的编程小助手，有什么不懂的尽管问我～' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res: any = await client.post('/ai/chat', {
        message: userMsg,
        lessonId,
        problemId,
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply || res.message || '我再想想...' }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '哎呀，小助手暂时离线了，你可以先看看课件上的例子～' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden">
      <div className="px-4 py-3 bg-primary-600 text-white flex items-center justify-between">
        <span className="font-bold">🤖 AI 小助手</span>
        <button onClick={onClose} className="hover:text-white/80">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm text-gray-500">思考中...</div>
          </div>
        )}
      </div>
      <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="输入问题..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={send}
          disabled={loading}
          className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
