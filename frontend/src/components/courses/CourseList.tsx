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
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LoadingState, ErrorState, EmptyState, useToast, useConfirm } from '@/components/shared'
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses'
import { useGrades } from '@/hooks/useGrades'
import { CourseModal } from './CourseModal'
import { CourseGradeDetailModal } from './CourseGradeDetailModal'
import type { Course, CourseStatus, GradeRecord } from '@/types/student'
import type { PortalTab } from '@/components/portal/Sidebar'

const DAY_LABELS: Record<string, string> = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ Nhật',
}

interface CourseListProps {
  onNavigateTab?: (tab: PortalTab) => void
}

export function CourseList({ onNavigateTab }: CourseListProps = {}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // State cho Modal Xem & Nhập Điểm Chi Tiết
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null)
  const [selectedGradeForDetail, setSelectedGradeForDetail] = useState<GradeRecord | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: courses, isLoading, isFetching, error, refetch } = useCourses({
    search: searchTerm,
    status: statusFilter,
  })

  const { data: grades } = useGrades()

  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()
  const deleteMutation = useDeleteCourse()
  const { toast } = useToast()
  const confirm = useConfirm()

  // Match grade record với course
  const findGradeForCourse = (course: Course): GradeRecord | undefined => {
    if (!grades) return undefined
    const cCode = course.code.trim().toUpperCase()
    const cId = course.id.trim().toUpperCase()
    return grades.find((g) => {
      const gCourseId = (g.courseId || '').trim().toUpperCase()
      const gCourseCode = ((g as { courseCode?: string }).courseCode || '').trim().toUpperCase()
      const gId = (g.id || '').trim().toUpperCase()
      return (
        gCourseId === cId ||
        gCourseCode === cCode ||
        gCourseId === cCode ||
        gCourseCode === cId ||
        gId === `G-${cId}` ||
        gId === `G-${cCode}`
      )
    })
  }

  const handleOpenDetail = (course: Course, grade?: GradeRecord) => {
    setSelectedCourseForDetail(course)
    setSelectedGradeForDetail(grade || null)
    setIsDetailModalOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingCourse(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: 'Xóa Học Phần',
      description: `Bạn có chắc chắn muốn xóa môn học "${name}"? Hành động này cũng sẽ xóa toàn bộ bài tập và điểm số liên quan đến môn học này.`,
      confirmText: 'Xóa học phần',
      variant: 'danger',
    })
    if (ok) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success(`Đã xóa môn học "${name}" thành công.`),
        onError: () => toast.error('Không thể xóa môn học. Vui lòng thử lại.'),
      })
    }
  }

  const handleFormSubmit = (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCourse) {
      updateMutation.mutate(
        { id: editingCourse.id, updates: data },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            toast.success(`Cập nhật học phần "${data.name}" thành công.`)
          },
          onError: () => toast.error('Cập nhật học phần thất bại.'),
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false)
          toast.success(`Thêm mới học phần "${data.name}" thành công.`)
        },
        onError: () => toast.error('Thêm mới học phần thất bại.'),
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
        <ErrorState
          title="Lỗi khi tải danh sách môn học"
          message={error.message || 'Không thể lấy dữ liệu học phần từ máy chủ.'}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <LoadingState count={6} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => {
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === course.id
            const grade = findGradeForCourse(course)

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
                    <div className="flex flex-wrap items-center gap-1.5">
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

                      {/* Huy hiệu điểm học phần trực tiếp trên Course Card */}
                      {grade && grade.overallScore > 0 ? (
                        <Badge
                          variant="secondary"
                          onClick={() => handleOpenDetail(course, grade)}
                          className={`cursor-pointer font-semibold text-xs gap-1 transition-all hover:scale-105 border ${
                            grade.overallScore < 4.0 || grade.finalExamScore < 3.0
                              ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300'
                              : grade.overallScore >= 8.5
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : grade.overallScore >= 7.0
                              ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                          title="Nhấn để xem chi tiết bảng điểm & chỉnh sửa"
                        >
                          <Award className="h-3 w-3" />
                          <span>{grade.letterGrade} ({grade.overallScore.toFixed(1)})</span>
                        </Badge>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(course, grade)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-muted/60 px-2 py-0.5 rounded-full hover:bg-muted"
                          title="Nhấn để nhập điểm cho học phần này"
                        >
                          <Award className="h-3 w-3 text-muted-foreground" />
                          <span>Nhập điểm</span>
                        </button>
                      )}
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

                  {/* Bảng điểm thành phần tóm tắt trực quan */}
                  {grade && (grade.attendanceScore > 0 || grade.midtermScore > 0 || (grade.practicalScore ?? 0) > 0 || grade.finalExamScore > 0 || grade.overallScore > 0) && (
                    <div
                      onClick={() => handleOpenDetail(course, grade)}
                      className="p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-all cursor-pointer border border-border/60 space-y-1.5 group/grade"
                      title="Bấm để xem và sửa điểm thành phần"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-foreground/80 flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-primary" /> Điểm thành phần:
                        </span>
                        <span className="font-semibold text-foreground">
                          GPA: <span className="text-primary font-bold">{grade.gpaScore?.toFixed(2) || '0.00'}</span> / 4.0
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center font-mono text-[11px]">
                        <div className="bg-background/80 py-1 px-0.5 rounded border border-border/40 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground font-sans">CC (10%)</div>
                          <div className="font-semibold">{grade.attendanceScore > 0 ? grade.attendanceScore : '-'}</div>
                        </div>
                        <div className="bg-background/80 py-1 px-0.5 rounded border border-border/40 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground font-sans">GK (30%)</div>
                          <div className="font-semibold">{grade.midtermScore > 0 ? grade.midtermScore : '-'}</div>
                        </div>
                        <div className="bg-background/80 py-1 px-0.5 rounded border border-border/40 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground font-sans">TH/BT</div>
                          <div className="font-semibold">{(grade.practicalScore ?? 0) > 0 ? grade.practicalScore : '-'}</div>
                        </div>
                        <div className="bg-background/80 py-1 px-0.5 rounded border border-border/40 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground font-sans">CK (50%)</div>
                          <div className="font-semibold">{grade.finalExamScore > 0 ? grade.finalExamScore : '-'}</div>
                        </div>
                      </div>
                    </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDetail(course, grade)}
                    className="h-7 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 gap-1.5 px-2"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Chi tiết & Điểm</span>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}

          {courses?.length === 0 && (
            <EmptyState
              title="Không tìm thấy môn học nào"
              description="Không có học phần nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại."
              actionLabel="Thêm Môn Học Ngay"
              onAction={handleOpenAdd}
              icon={BookOpen}
            />
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

      {/* Course Grade Detail & Input Modal */}
      <CourseGradeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        course={selectedCourseForDetail}
        grade={selectedGradeForDetail}
        onNavigateToGrades={() => {
          setIsDetailModalOpen(false)
          if (onNavigateTab) {
            onNavigateTab('grades')
          }
        }}
      />
    </div>
  )
}
