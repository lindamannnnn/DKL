import { useEffect, useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import client from '../../api/client'

interface Course {
  id: string
  title: string
  status: string
  levelMin: number
  levelMax: number
}

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showImport, setShowImport] = useState(false)
  const [markdown, setMarkdown] = useState('')

  useEffect(() => { loadCourses() }, [])

  const loadCourses = async () => {
    try { const res: any = await client.get('/courses'); setCourses(res) }
    catch (err) { console.error('加载课程失败:', err) }
  }

  const handleImport = async () => {
    try { await client.post('/courses/import', { markdown }); setShowImport(false); setMarkdown(''); loadCourses() }
    catch (err) { console.error('导入失败:', err) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">课程管理</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImport(true)} className="flex items-center btn-secondary text-sm">
            <Upload className="w-4 h-4 mr-2" />导入课件
          </button>
          <button className="flex items-center btn-primary text-sm">
            <Plus className="w-4 h-4 mr-2" />新建课程
          </button>
        </div>
      </div>
      {showImport && (
        <div className="card mb-6">
          <h3 className="font-bold text-gray-900 mb-4">导入 Markdown 课件</h3>
          <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} placeholder="粘贴 Markdown 课件内容..."
            className="w-full h-64 p-4 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500" />
          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={() => setShowImport(false)} className="btn-secondary text-sm">取消</button>
            <button onClick={handleImport} className="btn-primary text-sm">导入</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                GESP {course.levelMin}-{course.levelMax}级
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${course.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {course.status === 'published' ? '已发布' : '草稿'}
              </span>
            </div>
            <h3 className="font-bold text-gray-900">{course.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
