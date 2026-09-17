import { useState, useEffect } from 'react'
import { X, CheckSquare, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCourses } from '@/hooks/useCourses'
import type { Assignment, AssignmentPriority, AssignmentStatus } from '@/types/student'

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Assignment, 'id' | 'createdAt'>) => void
  initialData?: Assignment | null
  isSubmitting?: boolean
}

export function AssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: AssignmentModalProps) {
  const { data: courses } = useCourses()
  const [courseId, setCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<AssignmentPriority>('medium')
  const [status, setStatus] = useState<AssignmentStatus>('pending')
  const [estimatedHours, setEstimatedHours] = useState<number>(3)

  useEffect(() => {
    if (initialData) {
      setCourseId(initialData.courseId)
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      const dateVal = initialData.dueDate.includes('T')
        ? initialData.dueDate.substring(0, 16)
        : `${initialData.dueDate}T23:59`
      setDueDate(dateVal)
      setPriority(initialData.priority)
      setStatus(initialData.status)
      setEstimatedHours(initialData.estimatedHours || 2)
    } else {
      if (courses && courses.length > 0) {
        setCourseId(courses[0].id)
      }
      setTitle('')
      setDescription('')
      // Default to 5 days from now
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 5)
      setDueDate(`${nextWeek.toISOString().split('T')[0]}T23:59`)
      setPriority('medium')
      setStatus('pending')
      setEstimatedHours(3)
    }
  }, [initialData, isOpen, courses])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !courseId) return

    onSubmit({
      courseId,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || new Date().toISOString(),
      priority,
      status,
      estimatedHours: Number(estimatedHours) || 2,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            {initialData ? (
              <Edit3 className="h-5 w-5 text-primary" />
            ) : (
              <CheckSquare className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-lg font-bold">
              {initialData ? 'Chỉnh sửa Nhiệm vụ' : 'Thêm Bài tập / Deadline'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Course select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Thuộc học phần *</label>
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs focus:ring-1 focus:ring-ring"
            >
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.code}] {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Tên bài tập / Nhiệm vụ *</label>
            <Input
              required
              placeholder="VD: Viết tài liệu SRS đặc tả yêu cầu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Due date & Estimated hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Hạn nộp (Deadline) *</label>
              <Input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Thời gian dự kiến (giờ)</label>
              <Input
                type="number"
                min={0.5}
                step={0.5}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Mức độ ưu tiên</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AssignmentPriority)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs"
              >
                <option value="high">🔴 Cao (High)</option>
                <option value="medium">🟡 Trung bình (Medium)</option>
                <option value="low">🟢 Thấp (Low)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs"
              >
                <option value="pending">Chưa làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Ghi chú / Hướng dẫn</label>
            <textarea
              rows={3}
              className="w-full rounded-md border bg-background p-2 text-sm shadow-xs focus:ring-1 focus:ring-ring"
              placeholder="Ghi chú chi tiết yêu cầu bài nộp..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Đang lưu...'
                : initialData
                ? 'Cập nhật nhiệm vụ'
                : 'Thêm nhiệm vụ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
