import { Calendar, Clock, MapPin, User, BookOpen, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCourses } from '@/hooks/useCourses'
import type { DayOfWeek } from '@/types/student'

const DAYS: { key: DayOfWeek; label: string; subLabel: string }[] = [
  { key: 'Monday', label: 'Thứ 2', subLabel: 'Đầu tuần' },
  { key: 'Tuesday', label: 'Thứ 3', subLabel: 'Ngày 2' },
  { key: 'Wednesday', label: 'Thứ 4', subLabel: 'Giữa tuần' },
  { key: 'Thursday', label: 'Thứ 5', subLabel: 'Ngày 4' },
  { key: 'Friday', label: 'Thứ 6', subLabel: 'Cuối tuần học' },
  { key: 'Saturday', label: 'Thứ 7', subLabel: 'Học bù / Ngoại khóa' },
]

export function ScheduleView() {
  const { data: courses, isLoading, isFetching, refetch } = useCourses({ status: 'active' })

  // Group active courses by day
  const coursesByDay = DAYS.reduce((acc, day) => {
    acc[day.key] = (courses || []).filter((c) => c.schedule.dayOfWeek === day.key)
    return acc
  }, {} as Record<DayOfWeek, typeof courses>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Thời Khóa Biểu Tuần</h2>
          <p className="text-sm text-muted-foreground">
            Lịch học các học phần đang kích hoạt (Active) trong học kỳ hiện tại
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-primary' : ''}`} />
          <span>Làm mới thời khóa biểu</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-44 rounded-2xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((day) => {
            const dayCourses = coursesByDay[day.key] || []

            return (
              <div
                key={day.key}
                className="flex flex-col rounded-2xl border bg-card p-4 shadow-xs space-y-3"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">{day.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-[11px] py-0">
                    {dayCourses.length} môn học
                  </Badge>
                </div>

                {/* Course Slots */}
                <div className="flex-1 space-y-2.5">
                  {dayCourses.length > 0 ? (
                    dayCourses.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border p-3 text-xs space-y-2 transition-all hover:shadow-xs bg-muted/10"
                        style={{
                          borderLeft: `4px solid ${c.colorTag || '#3b82f6'}`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-foreground">
                            {c.code}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {c.credits} Tín chỉ
                          </span>
                        </div>

                        <div className="font-semibold text-sm line-clamp-1 text-foreground">
                          {c.name}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-muted-foreground pt-1 border-t">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" />
                            <span>{c.schedule.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span>Phòng: {c.schedule.room}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                          <User className="h-3 w-3" />
                          <span className="truncate">{c.instructor}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-center text-xs text-muted-foreground rounded-xl border border-dashed border-border/80">
                      <BookOpen className="h-5 w-5 text-muted-foreground/40 mb-1" />
                      <span>Không có lịch học</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
