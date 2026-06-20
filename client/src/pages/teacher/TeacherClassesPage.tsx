import { useState } from 'react'
import { Plus, Copy } from 'lucide-react'

export default function TeacherClassesPage() {
  const [classes] = useState([
    { id: '1', name: 'GESP 1级周末班', studentCount: 12, inviteCode: 'DKL2024A' },
    { id: '2', name: 'GESP 3级冲刺班', studentCount: 8, inviteCode: 'DKL2024B' },
  ])

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('邀请码已复制: ' + code)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">班级管理</h1>
        <button className="flex items-center btn-primary text-sm">
          <Plus className="w-4 h-4 mr-2" />创建班级
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="card">
            <h3 className="font-bold text-gray-900">{cls.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cls.studentCount} 名学生</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-500">邀请码:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{cls.inviteCode}</code>
              <button onClick={() => copyCode(cls.inviteCode)} className="text-primary-600 hover:text-primary-700">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
