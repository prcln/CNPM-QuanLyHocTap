import React from 'react'
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  UserCheck,
  Flame,
  LogOut,
  ShieldAlert,
  School,
  GraduationCap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export type PortalTab = 'overview' | 'courses' | 'assignments' | 'grades' | 'schedule' | 'activities'

interface SidebarProps {
  activeTab: PortalTab
  onSelectTab: (tab: PortalTab) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNavigateLanding: () => void
  onNavigateLogin?: () => void
  stats?: {
    totalCourses: number
    pendingAssignments: number
  }
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onNavigateLanding,
  onNavigateLogin,
  stats,
}) => {
  const { user, logout } = useAuth()

  const navItems = [
    {
      id: 'overview' as const,
      label: 'Tổng Quan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'courses' as const,
      label: 'Học Phần & Môn Học',
      icon: BookOpen,
      badge: stats?.totalCourses,
    },
    {
      id: 'assignments' as const,
      label: 'Bài Tập & Deadline',
      icon: CheckSquare,
      badge: stats?.pendingAssignments,
      badgeVariant: 'destructive' as const,
    },
    {
      id: 'grades' as const,
      label: 'Bảng Điểm & GPA',
      icon: Award,
      badge: null,
    },
    {
      id: 'schedule' as const,
      label: 'Thời Khóa Biểu',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'activities' as const,
      label: 'Hoạt Động & Săn ĐRL',
      icon: Flame,
      badge: null,
    },
  ]

  const displayName = user?.fullName || 'Nguyễn Văn An'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'SV'

  const subtitle =
    user?.role === 'AD'
      ? 'Quản Trị Viên Hệ Thống'
      : user?.role === 'GV'
      ? `${user.lecturerId || 'GV082'} • Giảng Viên`
      : `MSSV: ${user?.studentId || '20210001'} • K66`

  const RoleIcon =
    user?.role === 'AD' ? ShieldAlert : user?.role === 'GV' ? School : GraduationCap

  const handleLogout = async () => {
    await logout()
    if (onNavigateLogin) {
      onNavigateLogin()
    } else {
      onNavigateLanding()
    }
  }

  return (
    <aside
      className={`relative flex flex-col border-r bg-card/70 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Student Profile Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 ${
              user?.role === 'AD'
                ? 'bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600'
                : user?.role === 'GV'
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-700'
                : 'bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-700'
            }`}
          >
            {initials}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-foreground truncate">{displayName}</h4>
                <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <RoleIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Menu Quản Trị
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 text-white shadow-md shadow-sky-600/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <Badge
                  variant={item.badgeVariant || (isActive ? 'secondary' : 'outline')}
                  className={`text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-bold ${
                    isActive ? 'bg-white/20 text-white border-0' : ''
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t space-y-2">
        {/* Return to landing button */}
        <button
          onClick={onNavigateLanding}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Về Trang Giới Thiệu"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Trang Giới Thiệu</span>}
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Đăng xuất"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Đăng Xuất</span>}
        </button>

        {/* Collapse button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-1">Thu gọn menu</span>}
        </Button>
      </div>
    </aside>
  )
}
