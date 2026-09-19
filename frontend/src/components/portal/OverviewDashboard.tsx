import React from 'react'
import {
  BookOpen,
  CheckSquare,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  CheckCircle2,
  School,
  MapPin,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStudyStats } from '@/hooks/useStudyStats'
import { useCourses } from '@/hooks/useCourses'
import { useAssignments, useToggleAssignmentStatus } from '@/hooks/useAssignments'
import type { PortalTab } from './Sidebar'

interface OverviewDashboardProps {
  onNavigateTab: (tab: PortalTab) => void
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigateTab,
}) => {
  const { data: stats } = useStudyStats()
  const { data: courses = [] } = useCourses()
  const { data: assignments = [] } = useAssignments()
  const toggleAssignmentMutation = useToggleAssignmentStatus()

  // Active courses
  const activeCourses = courses.filter((c) => c.status === 'active')

  // Pending assignments sorted by deadline
  const pendingAssignments = assignments
    .filter((a) => a.status === 'pending' || a.status === 'in_progress')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Completed count
  const completedAssignmentsCount = assignments.filter((a) => a.status === 'completed').length

  // Calculate academic standing
  const currentGpa = stats?.overallGpa4 ?? 3.82
  const academicStanding =
    currentGpa >= 3.6
      ? 'Xuất sắc'
      : currentGpa >= 3.2
      ? 'Giỏi'
      : currentGpa >= 2.5
      ? 'Khá'
      : 'Trung bình'

  // Calculate day difference for deadlines
  const getDueStatus = (dueDateStr: string) => {
    const now = new Date()
    const due = new Date(dueDateStr)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: 'Quá hạn', variant: 'destructive' as const }
    } else if (diffDays === 0) {
      return { text: 'Hạn hôm nay', variant: 'destructive' as const }
    } else if (diffDays <= 3) {
      return { text: `Còn ${diffDays} ngày`, variant: 'destructive' as const }
    } else if (diffDays <= 7) {
      return { text: `Còn ${diffDays} ngày`, variant: 'secondary' as const }
    }
    return { text: `Còn ${diffDays} ngày`, variant: 'outline' as const }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                Học kỳ II • Năm học 2025 - 2026
              </span>
              <span className="text-xs text-muted-foreground">• Tuần học thứ 6</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Xin chào, Nguyễn Văn An! 👋
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Bạn đang có <span className="font-bold text-foreground">{pendingAssignments.length} bài tập</span> cần hoàn thành và <span className="font-bold text-foreground">{activeCourses.length} môn học</span> trong học kỳ này.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => onNavigateTab('assignments')}
              variant="outline"
              size="sm"
              className="rounded-xl border-border/70 hover:bg-accent text-xs font-medium"
            >
              <CheckSquare className="h-4 w-4 mr-1.5 text-indigo-500" />
              Xem Bài Tập
            </Button>
            <Button
              onClick={() => onNavigateTab('schedule')}
              size="sm"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium shadow-sm shadow-indigo-500/20"
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              Lịch Học Tuần
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPA Card */}
        <Card
          className="border border-border/80 hover:border-primary/40 transition-all cursor-pointer shadow-xs hover:shadow-md"
          onClick={() => onNavigateTab('grades')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              GPA Tạm Tính
            </CardTitle>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-foreground">
                {currentGpa.toFixed(2)}
                <span className="text-xs font-normal text-muted-foreground ml-1">/ 4.0</span>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] font-bold">
                {academicStanding}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span>Thang 10: {stats?.overallGpa10?.toFixed(2) || '8.92'}</span>
              <span>• Đạt chuẩn học bổng</span>
            </p>
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card
          className="border border-border/80 hover:border-primary/40 transition-all cursor-pointer shadow-xs hover:shadow-md"
          onClick={() => onNavigateTab('courses')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tín Chỉ Học Kỳ
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {stats?.totalCredits || 18}
              <span className="text-xs font-normal text-muted-foreground ml-1">tín chỉ</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {activeCourses.length} môn đang học • 0 môn rớt
            </p>
          </CardContent>
        </Card>

        {/* Pending Assignments Card */}
        <Card
          className="border border-border/80 hover:border-primary/40 transition-all cursor-pointer shadow-xs hover:shadow-md"
          onClick={() => onNavigateTab('assignments')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Deadline Cần Nộp
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-foreground">
                {pendingAssignments.length}
                <span className="text-xs font-normal text-muted-foreground ml-1">bài tập</span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-medium">
                Đã nộp: {completedAssignmentsCount}
              </Badge>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium flex items-center gap-1">
              <span>{pendingAssignments.filter((a) => a.priority === 'high').length} bài ưu tiên cao</span>
            </p>
          </CardContent>
        </Card>

        {/* Schedule / Classes Card */}
        <Card
          className="border border-border/80 hover:border-primary/40 transition-all cursor-pointer shadow-xs hover:shadow-md"
          onClick={() => onNavigateTab('schedule')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lớp Học Phần
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <School className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {courses.length}
              <span className="text-xs font-normal text-muted-foreground ml-1">học phần</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Thời khóa biểu đã xếp đủ các ca
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bento Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Today's Classes & Urgent Assignments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Urgent Deadlines Widget */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Bài Tập & Deadline Gần Nhất</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Danh sách bài tập cần ưu tiên hoàn thành sớm để không bị trễ hạn
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('assignments')}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                <span>Xem tất cả ({assignments.length})</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {pendingAssignments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <p>Tuyệt vời! Bạn không còn bài tập nào chưa nộp.</p>
                </div>
              ) : (
                pendingAssignments.slice(0, 4).map((assignment) => {
                  const statusInfo = getDueStatus(assignment.dueDate)
                  const courseMatch = courses.find((c) => c.id === assignment.courseId)
                  return (
                    <div
                      key={assignment.id}
                      className="p-3.5 rounded-xl border border-border/70 bg-card/60 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => toggleAssignmentMutation.mutate(assignment.id)}
                          className="mt-0.5 w-5 h-5 rounded-md border-2 border-border hover:border-emerald-500 flex items-center justify-center shrink-0 transition-colors"
                          title="Đánh dấu hoàn thành"
                        >
                          <span className="sr-only">Nộp bài</span>
                        </button>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">
                            {assignment.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground/80">{courseMatch?.name || 'Môn học'}</span>
                            <span>•</span>
                            <span>Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={statusInfo.variant}
                          className="text-[11px] font-semibold"
                        >
                          {statusInfo.text}
                        </Badge>
                        {assignment.priority === 'high' && (
                          <Badge variant="outline" className="border-rose-300 text-rose-600 dark:text-rose-400 text-[10px]">
                            Ưu tiên cao
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule Overview */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Thời Khóa Biểu & Lớp Học Phần Kỳ Này</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Các môn học đang diễn ra trong học kỳ 2025.2
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('schedule')}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                <span>Xem TKB tuần</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCourses.slice(0, 4).map((course) => (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {course.code}
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {course.credits} Tín chỉ
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground line-clamp-1">
                      {course.name}
                    </h4>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-muted-foreground/70" />
                        <span className="truncate">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground/70" />
                        <span>Phòng: {course.schedule?.room || 'Đang cập nhật'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Academic Goal & Quick Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* GPA Goal Tracker Card */}
          <Card className="border border-border/80 shadow-xs bg-gradient-to-b from-card to-card/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <span>Mục Tiêu Học Tập Kỳ Này</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Mục tiêu học bổng và điều kiện tốt nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-indigo-900 dark:text-indigo-200">Mục tiêu GPA: 3.60</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">Đạt 106%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-indigo-200/60 dark:bg-indigo-900/60 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-2">
                  GPA hiện tại: <span className="font-bold">{currentGpa.toFixed(2)}</span>. Bạn đang nằm trong danh sách xét cấp học bổng loại Xuất Sắc!
                </p>
              </div>

              {/* Quick Summary of Grades */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phân Bố Điểm Học Phần
                </h5>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">A / A+</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">3 Môn</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="font-bold text-blue-600 dark:text-blue-400">B / B+</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">2 Môn</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="font-bold text-amber-600 dark:text-amber-400">C / C+</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">0 Môn</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <p className="font-bold text-rose-600 dark:text-rose-400">F (Trượt)</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">0 Môn</p>
                  </div>
                </div>
              </div>

              {/* Action button to grades */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('grades')}
                className="w-full text-xs font-semibold rounded-xl"
              >
                Xem Bảng Điểm Chi Tiết
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tools Shortcuts */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Thao Tác Nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigateTab('courses')}
                className="w-full justify-start text-xs font-medium h-9 rounded-xl"
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-primary" />
                Thêm môn học mới
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigateTab('assignments')}
                className="w-full justify-start text-xs font-medium h-9 rounded-xl"
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-primary" />
                Tạo deadline bài tập mới
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigateTab('schedule')}
                className="w-full justify-start text-xs font-medium h-9 rounded-xl"
              >
                <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
                Kiểm tra thời khóa biểu hôm nay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
