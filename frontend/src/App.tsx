import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LandingPage } from '@/components/landing/LandingPage'
import { Sidebar } from '@/components/portal/Sidebar'
import type { PortalTab } from '@/components/portal/Sidebar'
import { OverviewDashboard } from '@/components/portal/OverviewDashboard'
import { CourseList } from '@/components/courses/CourseList'
import { AssignmentList } from '@/components/assignments/AssignmentList'
import { GradeTracker } from '@/components/grades/GradeTracker'
import { ScheduleView } from '@/components/schedule/ScheduleView'
import { ExtracurricularView } from '@/components/activities/ExtracurricularView'
import { MockApiControlBar } from '@/components/shared/MockApiControlBar'
import { useStudyStats } from '@/hooks/useStudyStats'
import { Badge } from '@/components/ui/badge'
import { BookOpen, CheckSquare, Award, Calendar, LayoutDashboard, Flame } from 'lucide-react'


export default function App() {
  const [view, setView] = useState<'landing' | 'portal'>('portal')
  const [activeTab, setActiveTab] = useState<PortalTab>('overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const { data: stats } = useStudyStats()

  // Initialize theme from system or class
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark')
    setIsDark(isDarkTheme)
  }, [])

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

  const handleEnterPortal = (targetTab?: PortalTab) => {
    setView('portal')
    if (targetTab) {
      setActiveTab(targetTab)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    setView('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const tabLabels: Record<PortalTab, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
    overview: {
      title: 'Bảng Điều Khiển Tổng Quan',
      subtitle: 'Xem nhanh tiến độ học tập, lịch học trong ngày và deadline cần nộp gấp',
      icon: LayoutDashboard,
    },
    courses: {
      title: 'Học Phần & Lớp Học',
      subtitle: 'Danh sách các môn học đăng ký trong học kỳ, số tín chỉ và giảng viên phụ trách',
      icon: BookOpen,
    },
    assignments: {
      title: 'Bài Tập & Deadline',
      subtitle: 'Theo dõi hạn nộp bài tập, phân cấp mức độ ưu tiên và đếm ngược thời gian thực',
      icon: CheckSquare,
    },
    grades: {
      title: 'Bảng Điểm & GPA Học Kỳ',
      subtitle: 'Tính điểm trung bình học phần, quy đổi sang thang điểm 4 và xếp loại học lực chuẩn tín chỉ',
      icon: Award,
    },
    schedule: {
      title: 'Thời Khóa Biểu Tuần',
      subtitle: 'Lưới hiển thị lịch học theo ngày và ca học trong tuần chuẩn QLĐT Bách Khoa HUST',
      icon: Calendar,
    },
    activities: {
      title: 'Hoạt Động Ngoại Khóa & Săn ĐRL',
      subtitle: 'Theo dõi sự kiện Đoàn - Hội, đăng ký tham gia và săn Điểm Rèn Luyện (ĐRL) chuẩn CTSV',
      icon: Flame,
    },
  }

  const currentTabMeta = tabLabels[activeTab]
  const TabIcon = currentTabMeta.icon

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {/* Universal Top Navbar */}
      <Navbar
        onEnterPortal={() => handleEnterPortal('overview')}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        activeView={view}
        onNavigateHome={handleNavigateHome}
      />

      {/* View 1: Landing Page */}
      {view === 'landing' ? (
        <>
          <main className="flex-1">
            <LandingPage onEnterPortal={handleEnterPortal} />
          </main>
          <Footer />
        </>
      ) : (
        /* View 2: Student Portal with Sidebar Dashboard */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            onNavigateLanding={handleNavigateHome}
            stats={{
              totalCourses: stats?.totalCourses || 0,
              pendingAssignments: stats?.pendingAssignments || 0,
            }}
          />

          {/* Right Main Portal Content */}
          <main className="flex-1 overflow-y-auto subtle-mesh p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Data Source & Latency Control Bar */}
              <MockApiControlBar />

              {/* Sub-header for active portal tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <TabIcon className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                      {currentTabMeta.title}
                    </h1>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentTabMeta.subtitle}
                  </p>
                </div>

                {/* Breadcrumb pill */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge variant="outline" className="text-xs px-2.5 py-1 font-medium bg-card/60">
                    Cổng Sinh Viên / {currentTabMeta.title}
                  </Badge>
                </div>
              </div>

              {/* Dynamic Content Body based on tab */}
              {activeTab === 'overview' && (
                <OverviewDashboard onNavigateTab={setActiveTab} />
              )}
              {activeTab === 'courses' && <CourseList />}
              {activeTab === 'assignments' && <AssignmentList />}
              {activeTab === 'grades' && <GradeTracker />}
              {activeTab === 'schedule' && (
                <ScheduleView onNavigateActivities={() => setActiveTab('activities')} />
              )}
              {activeTab === 'activities' && <ExtracurricularView />}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

