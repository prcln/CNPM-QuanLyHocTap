import { useState } from 'react'
import {
  BookOpen,
  CheckSquare,
  Award,
  Calendar,
  GraduationCap,
  Sun,
  Moon,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseList } from '@/components/courses/CourseList'
import { AssignmentList } from '@/components/assignments/AssignmentList'
import { GradeTracker } from '@/components/grades/GradeTracker'
import { ScheduleView } from '@/components/schedule/ScheduleView'
import { MockApiControlBar } from '@/components/shared/MockApiControlBar'
import { useStudyStats } from '@/hooks/useStudyStats'

type TabType = 'courses' | 'assignments' | 'grades' | 'schedule'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('courses')
  const [isDark, setIsDark] = useState(false)

  const { data: stats } = useStudyStats()

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badgeCount?: number }[] = [
    { id: 'courses', label: 'Học Phần & Môn Học', icon: BookOpen, badgeCount: stats?.totalCourses },
    { id: 'assignments', label: 'Bài Tập & Deadline', icon: CheckSquare, badgeCount: stats?.pendingAssignments },
    { id: 'grades', label: 'Bảng Điểm & GPA', icon: Award },
    { id: 'schedule', label: 'Thời Khóa Biểu', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg">CNPM - QLHT</span>
                <Badge variant="secondary" className="text-xs">
                  v2.0 (TanStack Query)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Hệ Thống Quản Lý Học Tập Sinh Viên Thông Minh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tech stack badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1 bg-muted/30">
              <Database className="h-3.5 w-3.5 text-primary" />
              <span>TanStack Query v5 + Mock API Layer</span>
            </div>

            {/* Dark mode switch */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9 rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-8 space-y-6">
        {/* Mock API Simulation Control Bar */}
        <MockApiControlBar />

        {/* Dynamic Study Stats Overview */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Môn Đang Học
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.activeCourses || 0}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  / {stats?.totalCourses || 0} môn
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Học kỳ 2 (2025-2026)</p>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Điểm GPA Tích Lũy
              </CardTitle>
              <Award className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats?.overallGpa4.toFixed(2) || '0.00'}{' '}
                <span className="text-xs font-normal text-muted-foreground">/ 4.0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Điểm TB hệ 10: <strong>{stats?.overallGpa10.toFixed(2) || '0.00'}</strong>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Bài Tập Cần Làm
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats?.pendingAssignments || 0}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  / {stats?.totalAssignments || 0} nhiệm vụ
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stats?.urgentDeadlinesCount || 0} bài sắp tới hạn (&le; 3 ngày)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tổng Tín Chỉ
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalCredits || 0}{' '}
                <span className="text-xs font-normal text-muted-foreground">tín chỉ</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stats?.completedCredits || 0} tín chỉ đã đạt
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Tab Navigation */}
        <section className="space-y-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {typeof tab.badgeCount === 'number' && (
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className="text-[11px] px-1.5 py-0 rounded-full"
                    >
                      {tab.badgeCount}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Panes */}
          <div className="min-h-[450px]">
            {activeTab === 'courses' && <CourseList />}
            {activeTab === 'assignments' && <AssignmentList />}
            {activeTab === 'grades' && <GradeTracker />}
            {activeTab === 'schedule' && <ScheduleView />}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 mt-16 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-foreground">Hệ Thống Quản Lý Học Tập (CNPM - QLHT)</span>
            <span>&bull;</span>
            <span>React 19 + TypeScript + Vite</span>
            <span>&bull;</span>
            <span>TanStack Query v5</span>
          </div>
          <p>
            Dữ liệu được lưu trữ tự động trong trình duyệt qua Mock API Layer (LocalStorage). Bạn có thể mở React Query Devtools ở góc dưới màn hình để kiểm tra Cache State.
          </p>
        </div>
      </footer>
    </div>
  )
}
