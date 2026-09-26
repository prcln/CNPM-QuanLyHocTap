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
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type PortalTab = 'overview' | 'courses' | 'assignments' | 'grades' | 'schedule'

interface SidebarProps {
  activeTab: PortalTab
  onSelectTab: (tab: PortalTab) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onNavigateLanding: () => void
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
  stats,
}) => {
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
  ]

  return (
    <aside
      className={`relative flex flex-col border-r bg-card/70 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Student Profile Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
            NA
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-foreground truncate">Nguyễn Văn An</h4>
                <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground truncate">MSSV: 20230142 • K68</p>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
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
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Về Trang Giới Thiệu"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Trang Giới Thiệu</span>}
        </button>

        {/* Collapse button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-1">Thu gọn menu</span>}
        </Button>
      </div>
    </aside>
  )
}
