import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LandingPage } from '@/components/landing/LandingPage'
import { LoginPage } from '@/components/auth/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import { Sidebar } from '@/components/portal/Sidebar'
import type { PortalTab } from '@/components/portal/Sidebar'
import { OverviewDashboard } from '@/components/portal/OverviewDashboard'
import { CourseList } from '@/components/courses/CourseList'
import { AssignmentList } from '@/components/assignments/AssignmentList'
import { GradeTracker } from '@/components/grades/GradeTracker'
import { ScheduleView } from '@/components/schedule/ScheduleView'
import { ExtracurricularView } from '@/components/activities/ExtracurricularView'
import { useStudyStats } from '@/hooks/useStudyStats'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import { parseRoute, syncUrl, type AppView } from '@/lib/router'

export type { AppView }

export default function App() {
  const { isAuthenticated } = useAuth()
  const [view, setView] = useState<AppView>(() => parseRoute().view)
  const [activeTab, setActiveTab] = useState<PortalTab>(() => parseRoute().tab || 'overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  const navigate = useCallback((nextView: AppView, nextTab?: PortalTab) => {
    setView(nextView)
    if (nextTab) {
      setActiveTab(nextTab)
    }
    syncUrl(nextView, nextTab || (nextView === 'portal' ? activeTab : undefined))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const handleSelectTab = (tab: PortalTab) => {
    setActiveTab(tab)
    syncUrl('portal', tab)
  }

  // Listen for 401 Unauthorized events from apiClient to redirect to login
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('login')
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [navigate])

  // Keep route in sync with browser navigation (Back / Forward / Hashchange / Reload)
  useEffect(() => {
    const initial = parseRoute()
    syncUrl(initial.view, initial.view === 'portal' ? initial.tab || 'overview' : undefined, true)

    const handleLocationChange = () => {
      const next = parseRoute()
      setView(next.view)
      if (next.tab) {
        setActiveTab(next.tab)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

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

  const handleLoginSuccess = (targetTab: PortalTab = 'overview') => {
    navigate('portal', targetTab)
  }

  const handleEnterPortal = (targetTab?: PortalTab) => {
    const hasStoredUser = typeof window !== 'undefined' && !!localStorage.getItem('cnpm_current_user')
    if (!isAuthenticated && !hasStoredUser) {
      navigate('login')
      return
    }
    navigate('portal', targetTab || activeTab || 'overview')
  }

  const handleNavigateHome = () => {
    navigate('landing')
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {/* Universal Top Navbar */}
      <Navbar
        onEnterPortal={() => handleEnterPortal('overview')}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        activeView={view === 'register' ? 'login' : view}
        onNavigateHome={handleNavigateHome}
        onNavigateLogin={() => navigate('login')}
      />

      {/* View 1: Landing Page */}
      {view === 'landing' && (
        <>
          <main className="flex-1">
            <LandingPage
              onEnterPortal={handleEnterPortal}
              onNavigateLogin={() => navigate('login')}
            />
          </main>
          <Footer />
        </>
      )}

      {/* View 2: Login Page */}
      {view === 'login' && (
        <>
          <main className="flex-1">
            <LoginPage
              onSuccess={() => handleLoginSuccess('overview')}
              onBackToLanding={handleNavigateHome}
              onSwitchToRegister={() => navigate('register')}
            />
          </main>
          <Footer />
        </>
      )}

      {/* View 3: Register Page */}
      {view === 'register' && (
        <>
          <main className="flex-1">
            <RegisterPage
              onRegisterSuccess={() => handleLoginSuccess('overview')}
              onSwitchToLogin={() => navigate('login')}
            />
          </main>
          <Footer />
        </>
      )}

      {/* View 4: Protected Portal Route Guard */}
      {view === 'portal' && !isAuthenticated && (
        <main className="flex-1 flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full text-center space-y-4 p-8 border border-border/80 rounded-2xl bg-card shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Yêu Cầu Đăng Nhập</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bạn cần đăng nhập để truy cập Cổng Học Tập và tra cứu thông tin học tập cá nhân theo quy định bảo mật hệ thống.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                onClick={() => navigate('login')}
                className="w-full bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 hover:from-sky-700 hover:to-blue-700 text-white font-semibold cursor-pointer"
              >
                Đăng Nhập Ngay
              </Button>
              <Button
                variant="outline"
                onClick={handleNavigateHome}
                className="w-full cursor-pointer"
              >
                Quay Lại Trang Chủ
              </Button>
            </div>
          </div>
        </main>
      )}

      {/* View 4: Authenticated Student Portal with Sidebar Dashboard */}
      {view === 'portal' && isAuthenticated && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            onNavigateLanding={handleNavigateHome}
            onNavigateLogin={() => navigate('login')}
            stats={{
              totalCourses: stats?.totalCourses || 0,
              pendingAssignments: stats?.pendingAssignments || 0,
            }}
          />

          {/* Right Main Portal Content */}
          <main className="flex-1 overflow-y-auto subtle-mesh p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Dynamic Content Body based on tab */}
              {activeTab === 'overview' && (
                <OverviewDashboard onNavigateTab={handleSelectTab} />
              )}
              {activeTab === 'courses' && <CourseList onNavigateTab={handleSelectTab} />}
              {activeTab === 'assignments' && <AssignmentList />}
              {activeTab === 'grades' && <GradeTracker />}
              {activeTab === 'schedule' && (
                <ScheduleView onNavigateActivities={() => handleSelectTab('activities')} />
              )}
              {activeTab === 'activities' && <ExtracurricularView />}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}