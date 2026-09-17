import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  Trash2,
  Edit2,
  GraduationCap,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses'
import { CourseModal } from './CourseModal'
import type { Course, CourseStatus } from '@/types/student'

const DAY_LABELS: Record<string, string> = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ Nhật',
}

export function CourseList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const { data: courses, isLoading, isFetching, error, refetch } = useCourses({
    search: searchTerm,
    status: statusFilter,
  })

  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()
  const deleteMutation = useDeleteCourse()

  const handleOpenAdd = () => {
    setEditingCourse(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${name}"? Hành động này cũng sẽ xóa bài tập và điểm số liên quan.`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSubmit = (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCourse) {
      updateMutation.mutate(
        { id: editingCourse.id, updates: data },
        {
          onSuccess: () => setIsModalOpen(false),
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  const statusOptions: { label: string; value: CourseStatus | 'all' }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang học', value: 'active' },
    { label: 'Sắp mở', value: 'upcoming' },
    { label: 'Đã hoàn thành', value: 'completed' },
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danh Sách Học Phần</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý các môn học, thời khóa biểu và trạng thái đăng ký tín chỉ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-primary' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" /> Thêm Môn Học
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã môn, tên môn, giảng viên, phòng..."
            className="pl-9 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === opt.value
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>Lỗi khi tải danh sách môn học: {error.message}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-5 w-24 bg-muted rounded"></div>
                <div className="h-6 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => {
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === course.id

            return (
              <Card
                key={course.id}
                className={`group flex flex-col justify-between transition-all duration-200 hover:shadow-md border-border/80 ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
                style={{
                  borderTop: `4px solid ${course.colorTag || '#3b82f6'}`,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono font-semibold text-xs">
                        {course.code}
                      </Badge>
                      <Badge
                        variant={
                          course.status === 'active'
                            ? 'default'
                            : course.status === 'upcoming'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {course.status === 'active'
                          ? 'Đang học'
                          : course.status === 'upcoming'
                          ? 'Sắp mở'
                          : 'Đã hoàn thành'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(course)}
                        title="Chỉnh sửa môn học"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(course.id, course.name)}
                        title="Xóa môn học"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold leading-snug line-clamp-2 mt-1">
                    {course.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    GV: <span className="font-medium text-foreground">{course.instructor}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pb-3 text-xs text-muted-foreground">
                  {course.description && (
                    <p className="line-clamp-2 text-xs italic text-muted-foreground/90">
                      {course.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{DAY_LABELS[course.schedule.dayOfWeek] || course.schedule.dayOfWeek}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{course.schedule.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Phòng: {course.schedule.room}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                      <span>{course.credits} Tín chỉ ({course.semester})</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground bg-muted/20 rounded-b-xl">
                  <span>Học kỳ: {course.semester}</span>
                  <span className="font-medium text-primary flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> Chi tiết
                  </span>
                </CardFooter>
              </Card>
            )
          })}

          {courses?.length === 0 && (
            <div className="col-span-full py-16 text-center border rounded-2xl bg-card space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="font-semibold text-base">Không tìm thấy môn học nào</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Không có học phần nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
              </p>
              <Button size="sm" onClick={handleOpenAdd} className="gap-1.5 mt-2">
                <Plus className="h-4 w-4" /> Thêm Môn Học Ngay
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Course Create/Edit Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCourse}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
