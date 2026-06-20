import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, BookOpen } from 'lucide-react'
import client from '../api/client'

interface CourseData {
  id: string
  title: string
  description: string | null
  chapters: {
    id: string
    title: string
    lessons: { id: string; title: string; sortOrder: number }[]
  }[]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) loadCourse()
  }, [id])

  const loadCourse = async () => {
    try {
      const res: any = await client.get(`/courses/${id}`)
      setCourse(res)
    } catch (err) {
      console.error('加载课程失败:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">课程不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/student/courses')}
            className="flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回课程大厅
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          {course.description && (
            <p className="text-gray-500 mt-2">{course.description}</p>
          )}
        </div>
      </div>

      {/* 章节列表 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {course.chapters.map((chapter, cIdx) => (
            <div key={chapter.id} className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
                  {cIdx + 1}
                </span>
                {chapter.title}
              </h2>

              <div className="space-y-2">
                {chapter.lessons.map((lesson, lIdx) => (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                    className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    <span className="w-6 h-6 bg-gray-100 text-gray-500 rounded-md flex items-center justify-center text-xs font-medium mr-3 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                      {lIdx + 1}
                    </span>
                    <span className="flex-1 text-gray-700 group-hover:text-gray-900">
                      {lesson.title}
                    </span>
                    <BookOpen className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
