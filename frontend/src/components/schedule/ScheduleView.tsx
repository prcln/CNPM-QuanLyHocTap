import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  CalendarDays,
  Layers,
  Flame,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCourses } from '@/hooks/useCourses'
import { useAssignments } from '@/hooks/useAssignments'
import { useActivities, useToggleActivityRegistration } from '@/hooks/useActivities'
import type { DayOfWeek, Course } from '@/types/student'

type ViewMode = 'calendar' | 'detail'
type SubTab = 'schedule' | 'teaching_assistants' | 'textbooks'

// Map JS day (0 = Sunday, 1 = Monday, ...) to student type DayOfWeek
const JS_DAY_TO_STUDENT_DAY: Record<number, DayOfWeek> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

interface ScheduleViewProps {
  onNavigateActivities?: () => void
}

export function ScheduleView({ onNavigateActivities }: ScheduleViewProps) {
  const { data: courses = [] } = useCourses({ status: 'active' })
  const { data: assignments = [] } = useAssignments()
  const { data: activities = [] } = useActivities()
  const toggleActivityMutation = useToggleActivityRegistration()

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('schedule')
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')

  // Calendar State: default to September 2026 (matching HUST UI & current mock environment)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 19)) // 19/09/2026
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 18)) // 18/09/2026 (matching screenshot)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0-indexed

  // Navigate month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleToday = () => {
    const today = new Date(2026, 8, 19)
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Generate calendar grid for currentMonth
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    let startingDayIndex = firstDayOfMonth.getDay() - 1
    if (startingDayIndex < 0) startingDayIndex = 6 // Sunday is column index 6

    const totalDaysInMonth = lastDayOfMonth.getDate()
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    const days: { date: Date; isCurrentMonth: boolean; dayNumber: number }[] = []

    for (let i = startingDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i
      days.push({
        date: new Date(currentYear, currentMonth - 1, d),
        isCurrentMonth: false,
        dayNumber: d,
      })
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({
        date: new Date(currentYear, currentMonth, d),
        isCurrentMonth: true,
        dayNumber: d,
      })
    }

    const remaining = (7 - (days.length % 7)) % 7
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, d),
        isCurrentMonth: false,
        dayNumber: d,
      })
    }

    return days
  }, [currentYear, currentMonth])

  // Map courses to each day of week for fast lookup
  const coursesByDayOfWeek = useMemo(() => {
    const map = new Map<DayOfWeek, Course[]>()
    courses.forEach((c) => {
      const day = c.schedule.dayOfWeek
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(c)
    })
    return map
  }, [courses])

  // Get courses for a specific calendar cell
  const getCoursesForDate = (date: Date): Course[] => {
    const dayOfWeek = JS_DAY_TO_STUDENT_DAY[date.getDay()]
    return coursesByDayOfWeek.get(dayOfWeek) || []
  }

  // Format date string YYYY-MM-DD
  const formatDateStr = (date: Date): string => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Get activities on a specific date
  const getActivitiesForDate = (date: Date) => {
    const dateStr = formatDateStr(date)
    return activities.filter((a) => a.date === dateStr)
  }

  // Check if date is today (19/09/2026 or real today)
  const isToday = (date: Date) => {
    return (
      date.getDate() === 19 &&
      date.getMonth() === 8 &&
      date.getFullYear() === 2026
    )
  }

  // Check if date is selected
  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Classes for the currently selected date
  const selectedDayOfWeek = JS_DAY_TO_STUDENT_DAY[selectedDate.getDay()]
  const selectedDayCourses = coursesByDayOfWeek.get(selectedDayOfWeek) || []
  const selectedDayActivities = getActivitiesForDate(selectedDate)

  // Deadlines on selected date
  const selectedDateStr = formatDateStr(selectedDate)
  const selectedDayAssignments = assignments.filter((a) =>
    a.dueDate.startsWith(selectedDateStr)
  )

  const vietnameseDayLabel: Record<DayOfWeek, string> = {
    Monday: 'Thứ 2',
    Tuesday: 'Thứ 3',
    Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5',
    Friday: 'Thứ 6',
    Saturday: 'Thứ 7',
    Sunday: 'Chủ Nhật',
  }

  return (
    <div className="space-y-8">
      {/* Top Tabs - HUST Style: [Thời khoá biểu] [Lớp trợ giảng] [Sách giáo trình] */}
      <div className="flex items-center gap-8 border-b border-border/80 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`relative pb-3 transition-colors ${
            activeSubTab === 'schedule'
              ? 'text-red-700 dark:text-red-500 font-bold border-b-2 border-red-700 dark:border-red-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Thời khoá biểu
        </button>
        <button
          onClick={() => setActiveSubTab('teaching_assistants')}
          className={`relative pb-3 transition-colors ${
            activeSubTab === 'teaching_assistants'
              ? 'text-red-700 dark:text-red-500 font-bold border-b-2 border-red-700 dark:border-red-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Lớp trợ giảng
        </button>
        <button
          onClick={() => setActiveSubTab('textbooks')}
          className={`relative pb-3 transition-colors ${
            activeSubTab === 'textbooks'
              ? 'text-red-700 dark:text-red-500 font-bold border-b-2 border-red-700 dark:border-red-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sách giáo trình
        </button>
      </div>

      {/* Subtab: Lớp trợ giảng / Sách giáo trình placeholder */}
      {activeSubTab !== 'schedule' ? (
        <div className="p-12 text-center rounded-2xl border bg-card/60 space-y-3">
          <Layers className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">
            {activeSubTab === 'teaching_assistants' ? 'Danh sách Lớp trợ giảng' : 'Tài liệu & Sách giáo trình'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Học kỳ hiện tại chưa có thông tin bổ sung cho mục này. Vui lòng quay lại tab Thời khoá biểu.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveSubTab('schedule')}
            className="rounded-xl mt-2 text-xs"
          >
            Quay lại Thời khoá biểu
          </Button>
        </div>
      ) : (
        <>
          {/* Subheader Controls: Radio (Lịch / Chi tiết) & Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Radio View Mode Selector */}
            <div className="flex items-center gap-6 text-sm font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule_view_mode"
                  checked={viewMode === 'calendar'}
                  onChange={() => setViewMode('calendar')}
                  className="w-4 h-4 text-red-700 focus:ring-red-600 accent-red-700"
                />
                <span className={viewMode === 'calendar' ? 'font-bold text-foreground' : 'text-muted-foreground'}>
                  Lịch
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedule_view_mode"
                  checked={viewMode === 'detail'}
                  onChange={() => setViewMode('detail')}
                  className="w-4 h-4 text-red-700 focus:ring-red-600 accent-red-700"
                />
                <span className={viewMode === 'detail' ? 'font-bold text-foreground' : 'text-muted-foreground'}>
                  Chi tiết
                </span>
              </label>
            </div>

            {/* Right Buttons: Hôm nay & Dropdown Lịch tháng */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="rounded-full px-4 h-8 text-xs font-semibold text-red-700 border-red-300 dark:border-red-900/80 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Hôm nay
              </Button>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border bg-card text-xs font-medium text-foreground">
                <CalendarDays className="h-3.5 w-3.5 text-red-700" />
                <span>Lịch tháng</span>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: LỊCH (CALENDAR 2-COLUMN VIEW - CHUẨN HUST QLĐT) */}
          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 cols): Monthly Interactive Calendar */}
              <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                {/* Calendar Header with arrows & month name */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-full border border-border/80 hover:border-red-700 flex items-center justify-center text-muted-foreground hover:text-red-700 transition-colors"
                    aria-label="Tháng trước"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    Tháng {currentMonth + 1}, {currentYear}
                  </h3>

                  <button
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-full border border-border/80 hover:border-red-700 flex items-center justify-center text-muted-foreground hover:text-red-700 transition-colors"
                    aria-label="Tháng sau"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Day of Week Headers: T2, T3, T4, T5, T6, T7, CN */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                  {calendarDays.map((cell, idx) => {
                    const dayCourses = getCoursesForDate(cell.date)
                    const dayActs = getActivitiesForDate(cell.date)
                    const hasClass = dayCourses.length > 0
                    const hasActivity = dayActs.length > 0
                    const selected = isSelected(cell.date)
                    const today = isToday(cell.date)

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(cell.date)}
                        className="flex flex-col items-center justify-center cursor-pointer group py-1"
                      >
                        {/* Day Number Circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                            selected
                              ? 'bg-red-700 text-white font-bold shadow-md shadow-red-700/30'
                              : today
                              ? 'border-2 border-red-600 text-red-700 dark:text-red-400 font-bold'
                              : cell.isCurrentMonth
                              ? 'text-foreground hover:bg-muted/80 font-medium'
                              : 'text-muted-foreground/40 font-normal'
                          }`}
                        >
                          {cell.dayNumber}
                        </div>

                        {/* Dot indicators: Yellow for class, Purple/Red for Extracurricular */}
                        <div className="h-2 flex items-center justify-center gap-0.5 mt-0.5">
                          {hasClass && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                selected ? 'bg-amber-400' : 'bg-amber-500'
                              }`}
                              title={`${dayCourses.length} môn học`}
                            />
                          )}
                          {hasActivity && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                selected ? 'bg-purple-300' : 'bg-purple-600 dark:bg-purple-400'
                              }`}
                              title={`${dayActs.length} hoạt động ngoại khóa`}
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend caption */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span>Lịch học</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 inline-block" />
                    <span>Sự kiện ngoại khóa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-700 inline-block" />
                    <span>Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-red-600 inline-block" />
                    <span>Hôm nay</span>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Thông tin chi tiết (HUST Style) */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-50/80 dark:bg-card/70 border border-border/70 p-6 sm:p-8 space-y-6 min-h-[440px]">
                {/* Section Header */}
                <div className="text-center pb-2 border-b border-border/50">
                  <h3 className="text-lg font-bold text-foreground">
                    Thông tin chi tiết
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {vietnameseDayLabel[selectedDayOfWeek]}, ngày {selectedDate.getDate()} tháng {selectedDate.getMonth() + 1}, {selectedDate.getFullYear()}
                  </p>
                </div>

                {/* 1. Course List on Selected Day */}
                {selectedDayCourses.length === 0 && selectedDayActivities.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground/60">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">
                        Không có lịch học hoặc sự kiện trong ngày này
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Bạn có thể dành thời gian để tự học, ôn bài hoặc hoàn thành các bài tập và deadline sắp tới.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Academic classes */}
                    {selectedDayCourses.map((course) => {
                      const timeParts = course.schedule.timeSlot.split('-')
                      const startTime = timeParts[0]?.trim() || '10:15'
                      const endTime = timeParts[1]?.trim() || '11:45'

                      return (
                        <div
                          key={course.id}
                          className="rounded-2xl border border-border/80 bg-background/90 p-5 shadow-xs transition-all hover:border-red-700/40"
                        >
                          <div className="grid grid-cols-12 gap-4">
                            {/* Left: Time axis */}
                            <div className="col-span-3 sm:col-span-2 flex flex-col justify-between text-xs font-semibold text-muted-foreground border-r pr-3">
                              <span className="text-foreground font-bold">{startTime}</span>
                              <div className="w-px h-6 bg-border mx-auto my-1" />
                              <span>{endTime}</span>
                            </div>

                            {/* Right: Course details */}
                            <div className="col-span-9 sm:col-span-10 space-y-2">
                              <h4 className="font-bold text-sm sm:text-base text-red-700 dark:text-red-500 leading-snug">
                                {course.code} - {course.name}
                              </h4>

                              <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">Thời gian:</span>
                                  <span>
                                    {vietnameseDayLabel[course.schedule.dayOfWeek]}, [{course.schedule.timeSlot}]
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">Địa điểm:</span>
                                  <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-muted/60">
                                    {course.schedule.room || 'D4-205'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">Bài học:</span>
                                  <span className="italic text-muted-foreground/80">Lý thuyết & Bài tập trên lớp</span>
                                </div>

                                <div className="flex items-center gap-2 pt-0.5">
                                  <span className="font-medium text-foreground">Giảng viên:</span>
                                  <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
                                    {course.instructor}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Extracurricular activities on this date */}
                    {selectedDayActivities.length > 0 && (
                      <div className="pt-2 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400">
                          <Flame className="h-4 w-4" />
                          <span>Hoạt động ngoại khóa & Săn ĐRL trong ngày ({selectedDayActivities.length})</span>
                        </div>

                        {selectedDayActivities.map((act) => (
                          <div
                            key={act.id}
                            className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-foreground">{act.title}</span>
                                <Badge className="bg-red-600 text-white text-[10px] font-bold">
                                  +{act.drlPoints} ĐRL
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {act.time} • {act.location} • Tổ chức: {act.organizer}
                              </p>
                            </div>

                            <Button
                              size="sm"
                              variant={act.registered ? 'secondary' : 'default'}
                              onClick={() => toggleActivityMutation.mutate(act.id)}
                              className={`rounded-lg text-xs font-semibold h-8 shrink-0 ${
                                act.registered
                                  ? 'border border-emerald-500/40 text-emerald-600'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                            >
                              {act.registered ? '✓ Đã lưu lịch' : 'Đăng ký'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Deadlines notice if any */}
                {selectedDayAssignments.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <Clock className="h-4 w-4" />
                      <span>Hạn nộp bài tập trong ngày ({selectedDayAssignments.length})</span>
                    </div>
                    {selectedDayAssignments.map((a) => (
                      <div key={a.id} className="text-xs flex items-center justify-between text-muted-foreground">
                        <span className="font-medium text-foreground">• {a.title}</span>
                        <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600">
                          Hạn chót
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: CHI TIẾT (FULL TABLE VIEW) */
            <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b bg-muted/20 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Danh Sách Học Phần Đang Học Kỳ Này</h3>
                  <p className="text-xs text-muted-foreground">Xem toàn bộ thời gian, địa điểm và phòng học</p>
                </div>
                <Badge variant="secondary" className="text-xs font-semibold">
                  Tổng số: {courses.length} học phần
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b bg-muted/15 text-xs font-semibold text-muted-foreground">
                      <th className="py-3 px-4">Mã Môn</th>
                      <th className="py-3 px-4">Tên Học Phần</th>
                      <th className="py-3 px-4">Tín Chỉ</th>
                      <th className="py-3 px-4">Thứ / Ngày</th>
                      <th className="py-3 px-4">Khung Giờ</th>
                      <th className="py-3 px-4">Phòng Học</th>
                      <th className="py-3 px-4">Giảng Viên</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-red-700 dark:text-red-500 font-mono">
                          {course.code}
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {course.name}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-[11px]">
                            {course.credits} TC
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">
                          {vietnameseDayLabel[course.schedule.dayOfWeek]}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono">
                          {course.schedule.timeSlot}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted/60">
                            {course.schedule.room}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-medium">
                          {course.instructor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. TÍCH HỢP SỰ KIỆN NGOẠI KHÓA & HOẠT ĐỘNG RÈN LUYỆN BÊN DƯỚI THỜI KHÓA BIỂU */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-bold text-foreground">
                    Sự Kiện Ngoại Khóa & Hoạt Động Rèn Luyện Sắp Tới
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Đối chiếu lịch học để đăng ký tham gia săn Điểm Rèn Luyện (ĐRL) không bị trùng ca học
                </p>
              </div>

              {onNavigateActivities && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateActivities}
                  className="rounded-xl text-xs font-semibold gap-1.5 self-start sm:self-auto border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <span>Mở Trang Hoạt Động & Săn ĐRL</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Activities Preview Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-border/70 bg-muted/20 hover:bg-card hover:border-red-700/40 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-600/10 text-red-700 dark:text-red-400 border border-red-600/20">
                        +{act.drlPoints} ĐRL
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {act.registeredCount} SV đã đăng ký
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground line-clamp-2">
                      {act.title}
                    </h4>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-red-600" />
                        <span>
                          {new Date(act.date).toLocaleDateString('vi-VN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'numeric',
                          })}
                          {' • '}{act.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span className="truncate">{act.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <Button
                      variant={act.registered ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => toggleActivityMutation.mutate(act.id)}
                      className={`w-full rounded-lg text-xs font-semibold h-8 ${
                        act.registered
                          ? 'border border-emerald-500/40 text-emerald-600'
                          : 'bg-red-700 hover:bg-red-800 text-white'
                      }`}
                    >
                      {act.registered ? '✓ Đã lưu vào lịch' : 'Đăng ký tham gia'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
