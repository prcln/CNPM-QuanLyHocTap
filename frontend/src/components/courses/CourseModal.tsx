import { useState, useEffect } from 'react'
import { X, BookPlus, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Course, CourseStatus, DayOfWeek } from '@/types/student'

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialData?: Course | null
  isSubmitting?: boolean
}

const PRESET_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#64748b']

const DAYS: { label: string; value: DayOfWeek }[] = [
  { label: 'Thứ 2', value: 'Monday' },
  { label: 'Thứ 3', value: 'Tuesday' },
  { label: 'Thứ 4', value: 'Wednesday' },
  { label: 'Thứ 5', value: 'Thursday' },
  { label: 'Thứ 6', value: 'Friday' },
  { label: 'Thứ 7', value: 'Saturday' },
]

export function CourseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: CourseModalProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [instructor, setInstructor] = useState('')
  const [credits, setCredits] = useState<number>(3)
  const [semester, setSemester] = useState('HK2 2025-2026')
  const [status, setStatus] = useState<CourseStatus>('active')
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday')
  const [timeSlot, setTimeSlot] = useState('07:30 - 10:00')
  const [room, setRoom] = useState('A2.10')
  const [colorTag, setColorTag] = useState('#3b82f6')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code)
      setName(initialData.name)
      setInstructor(initialData.instructor)
      setCredits(initialData.credits)
      setSemester(initialData.semester)
      setStatus(initialData.status)
      setDayOfWeek(initialData.schedule.dayOfWeek)
      setTimeSlot(initialData.schedule.timeSlot)
      setRoom(initialData.schedule.room)
      setColorTag(initialData.colorTag || '#3b82f6')
      setDescription(initialData.description || '')
    } else {
      setCode('')
      setName('')
      setInstructor('')
      setCredits(3)
      setSemester('HK2 2025-2026')
      setStatus('active')
      setDayOfWeek('Monday')
      setTimeSlot('07:30 - 10:00')
      setRoom('A2.10')
      setColorTag('#3b82f6')
      setDescription('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return

    onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      instructor: instructor.trim() || 'Chưa phân công',
      credits: Number(credits) || 3,
      semester,
      status,
      schedule: {
        dayOfWeek,
        timeSlot: timeSlot.trim() || '07:30 - 10:00',
        room: room.trim() || 'Online',
      },
      colorTag,
      description: description.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            {initialData ? (
              <Edit3 className="h-5 w-5 text-primary" />
            ) : (
              <BookPlus className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-lg font-bold">
              {initialData ? 'Chỉnh sửa Học phần' : 'Thêm Học phần Mới'}
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
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Mã môn *</label>
              <Input
                required
                placeholder="VD: SE104"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tên môn học *</label>
              <Input
                required
                placeholder="VD: Nhập môn Công nghệ Phần mềm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Giảng viên phụ trách</label>
              <Input
                placeholder="VD: TS. Nguyễn Văn A"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Số tín chỉ</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Học kỳ</label>
              <Input
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs focus:ring-1 focus:ring-ring"
              >
                <option value="active">Đang học (Active)</option>
                <option value="upcoming">Sắp mở (Upcoming)</option>
                <option value="completed">Đã hoàn thành (Completed)</option>
              </select>
            </div>
          </div>

          {/* Schedule section */}
          <div className="rounded-xl border p-3 bg-muted/30 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lịch học & Phòng
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Thứ</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-xs shadow-xs"
                >
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Ca học</label>
                <Input
                  className="h-8 text-xs"
                  placeholder="07:30 - 10:00"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phòng học</label>
                <Input
                  className="h-8 text-xs"
                  placeholder="A2.10"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Color tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Màu phân loại</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorTag(color)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    colorTag === color ? 'scale-125 ring-2 ring-primary ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Mô tả môn học</label>
            <textarea
              rows={2}
              className="w-full rounded-md border bg-background p-2 text-sm shadow-xs focus:ring-1 focus:ring-ring"
              placeholder="Mô tả tóm tắt nội dung học tập..."
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
                ? 'Cập nhật học phần'
                : 'Thêm học phần'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
