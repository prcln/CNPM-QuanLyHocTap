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
  Flame,
  LogOut,
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
  const { logout } = useAuth()

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
