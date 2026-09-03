import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

// 页面
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CourseHallPage from './pages/CourseHallPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LessonPage from './pages/LessonPage'
import ProblemPage from './pages/ProblemPage'
import ProblemListPage from './pages/ProblemListPage'
import ProblemLevelPage from './pages/ProblemLevelPage'
import DashboardPage from './pages/DashboardPage'
import ExamListPage from './pages/ExamListPage'
import ExamPage from './pages/ExamPage'
import ExamResultPage from './pages/ExamResultPage'
import AchievementsPage from './pages/AchievementsPage'
import KnowledgeSearchPage from './pages/KnowledgeSearchPage'
import ErrorBoundary from './components/ErrorBoundary'

// 教师后台
import TeacherLayout from './pages/teacher/TeacherLayout'
import TeacherCoursesPage from './pages/teacher/TeacherCoursesPage'
import TeacherProblemsPage from './pages/teacher/TeacherProblemsPage'
import TeacherClassesPage from './pages/teacher/TeacherClassesPage'

function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 学生端 */}
        <Route path="/student">
          <Route path="courses" element={<CourseHallPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="lessons/:id" element={<LessonPage />} />
          <Route path="problems" element={<ProblemListPage />} />
          <Route path="problems/level/:level" element={<ProblemLevelPage />} />
          <Route path="problems/:id" element={<ProblemPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="exams" element={<ExamListPage />} />
          <Route path="exams/:id" element={<ExamPage />} />
          <Route path="exams/:id/result" element={<ExamResultPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="knowledge" element={<KnowledgeSearchPage />} />
        </Route>

        {/* 教师后台 */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="courses" element={<TeacherCoursesPage />} />
          <Route path="problems" element={<TeacherProblemsPage />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="exams" element={<ExamListPage />} />
          <Route path="exams/create" element={<div className="p-6">教师创建考试页面（待完善）</div>} />
        </Route>

        {/* 默认跳转 */}
        <Route path="/" element={<Navigate to="/student/courses" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
