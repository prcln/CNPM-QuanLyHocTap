import { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  useAssignments,
  useCreateAssignment,
  useUpdateAssignment,
  useToggleAssignmentStatus,
  useDeleteAssignment,
} from '@/hooks/useAssignments'
import { useCourses } from '@/hooks/useCourses'
import { AssignmentModal } from './AssignmentModal'
import type { Assignment, AssignmentPriority, AssignmentStatus } from '@/types/student'

export function AssignmentList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<AssignmentPriority | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)

  const { data: assignments, isLoading, isFetching, refetch } = useAssignments({
    courseId: selectedCourseId,
    status: statusFilter,
    priority: priorityFilter,
    search: searchTerm,
  })

  const { data: courses } = useCourses()
  const createMutation = useCreateAssignment()
  const updateMutation = useUpdateAssignment()
  const toggleMutation = useToggleAssignmentStatus()
  const deleteMutation = useDeleteAssignment()

  const handleOpenAdd = () => {
    setEditingAssignment(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: Assignment) => {
    setEditingAssignment(item)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài tập "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id)
  }

  const handleFormSubmit = (data: Omit<Assignment, 'id' | 'createdAt'>) => {
    if (editingAssignment) {
      updateMutation.mutate(
        { id: editingAssignment.id, updates: data },
        { onSuccess: () => setIsModalOpen(false) },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      })
    }
  }

  // Format due date badge & countdown
  const getDueDateInfo = (dueDateStr: string, isCompleted: boolean, referenceTime: number) => {
    if (isCompleted) {
      return {
        label: 'Đã hoàn thành',
        isUrgent: false,
        isOverdue: false,
        colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      }
    }

    const due = new Date(dueDateStr).getTime()
    const diffHours = Math.round((due - referenceTime) / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffHours / 24)

    if (diffHours < 0) {
      return {
        label: `Quá hạn ${Math.abs(diffDays)} ngày`,
        isUrgent: true,
        isOverdue: true,
        colorClass: 'text-destructive bg-destructive/10 border-destructive/30',
      }
    }
    if (diffDays === 0) {
      return {
        label: `Hôm nay (còn ${diffHours}h)`,
        isUrgent: true,
        isOverdue: false,
        colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
      }
    }
    if (diffDays <= 3) {
      return {
        label: `Còn ${diffDays} ngày`,
        isUrgent: true,
        isOverdue: false,
        colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
      }
    }
    return {
      label: `Còn ${diffDays} ngày`,
      isUrgent: false,
      isOverdue: false,
      colorClass: 'text-muted-foreground bg-muted border-border',
    }
  }

  const [currentTimestamp] = useState(() => Date.now())
  const courseMap = new Map(courses?.map((c) => [c.id, c]))

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bài Tập & Nhiệm Vụ Deadline</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi tiến độ bài tập lớn, đồ án và các hạn nộp học phần
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
            <Plus className="h-4 w-4" /> Thêm Nhiệm Vụ
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên bài tập, mô tả..."
            className="pl-9 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by course */}
        <div>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full h-9 rounded-md border bg-background px-3 text-xs shadow-xs focus:ring-1 focus:ring-ring"
          >
            <option value="all">Tất cả môn học</option>
            {courses?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | 'all')}
            className="w-full h-9 rounded-md border bg-background px-3 text-xs shadow-xs focus:ring-1 focus:ring-ring"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chưa làm (Pending)</option>
            <option value="in_progress">Đang làm (In Progress)</option>
            <option value="completed">Đã xong (Completed)</option>
          </select>
        </div>

        {/* Filter by priority */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as AssignmentPriority | 'all')}
            className="w-full h-9 rounded-md border bg-background px-3 text-xs shadow-xs focus:ring-1 focus:ring-ring"
          >
            <option value="all">Tất cả độ ưu tiên</option>
            <option value="high">🔴 Cao (High)</option>
            <option value="medium">🟡 Trung bình (Medium)</option>
            <option value="low">🟢 Thấp (Low)</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 rounded-xl border bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {assignments?.map((item) => {
            const course = courseMap.get(item.courseId)
            const isCompleted = item.status === 'completed'
            const dueInfo = getDueDateInfo(item.dueDate, isCompleted, currentTimestamp)
            const isToggling = toggleMutation.isPending && toggleMutation.variables === item.id
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === item.id

            return (
              <div
                key={item.id}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-xs ${
                  isCompleted ? 'bg-muted/20 opacity-80' : ''
                } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                style={{
                  borderLeft: `4px solid ${course?.colorTag || '#3b82f6'}`,
                }}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    disabled={isToggling}
                    className="mt-0.5 rounded-full p-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
                    title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:border-primary" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-semibold transition-all ${
                          isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {item.title}
                      </span>

                      {/* Course badge */}
                      {course && (
                        <Badge variant="outline" className="text-xs font-mono py-0 px-2">
                          {course.code}
                        </Badge>
                      )}

                      {/* Priority badge */}
                      <Badge
                        variant="outline"
                        className={`text-xs py-0 px-2 ${
                          item.priority === 'high'
                            ? 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10'
                            : item.priority === 'medium'
                            ? 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.priority === 'high'
                          ? 'Ưu tiên cao'
                          : item.priority === 'medium'
                          ? 'Trung bình'
                          : 'Thấp'}
                      </Badge>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Deadline info & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${dueInfo.colorClass}`}
                    >
                      {dueInfo.isOverdue ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Calendar className="h-3 w-3" />
                      )}
                      <span>
                        {new Date(item.dueDate).toLocaleDateString('vi-VN')} ({dueInfo.label})
                      </span>
                    </div>

                    {item.estimatedHours && (
                      <span className="text-xs text-muted-foreground hidden md:inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.estimatedHours}h
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(item)}
                      title="Chỉnh sửa nhiệm vụ"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Xóa bài tập"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {assignments?.length === 0 && (
            <div className="py-16 text-center border rounded-2xl bg-card space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold text-base">Không có bài tập nào cần làm</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Tuyệt vời! Bạn đã hoàn thành hết các nhiệm vụ hoặc chưa có bài tập nào theo bộ lọc này.
              </p>
              <Button size="sm" onClick={handleOpenAdd} className="gap-1.5 mt-2">
                <Plus className="h-4 w-4" /> Thêm Bài Tập Mới
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAssignment}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
