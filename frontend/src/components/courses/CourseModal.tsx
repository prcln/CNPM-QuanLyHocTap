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

const PRESET_COLORS = ['#0284c7', '#0ea5e9', '#06b6d4', '#0d9488', '#10b981', '#f59e0b', '#3b82f6']

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
  const [departmentCode, setDepartmentCode] = useState('Trường CNTT & TT')
  const [instructor, setInstructor] = useState('')
  const [credits, setCredits] = useState<number>(3)
  const [tuitionCredits, setTuitionCredits] = useState<number>(3)
  const [isCompulsory, setIsCompulsory] = useState<boolean>(true)
  const [allocation, setAllocation] = useState('3(2-1-0-6)')
  const [semester, setSemester] = useState('20261')
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
      setDepartmentCode(initialData.departmentCode || 'Trường CNTT & TT')
      setInstructor(initialData.instructor)
      setCredits(initialData.credits)
      setTuitionCredits(initialData.tuitionCredits ?? initialData.credits)
      setIsCompulsory(initialData.isCompulsory ?? true)
      setAllocation(initialData.allocation || `${initialData.credits}(2-1-0-6)`)
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
      setDepartmentCode('Trường CNTT & TT')
      setInstructor('')
      setCredits(3)
      setTuitionCredits(3)
      setIsCompulsory(true)
      setAllocation('3(2-1-0-6)')
      setSemester('20261')
      setStatus('active')
      setDayOfWeek('Monday')
      setTimeSlot('07:30 - 10:00')
      setRoom('A2.10')
      setColorTag('#3b82f6')
      setDescription('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleCreditsChange = (val: number) => {
    setCredits(val)
    if (!initialData) {
      setTuitionCredits(val)
      setAllocation(`${val}(2-1-0-6)`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return

    onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      departmentCode: departmentCode.trim() || 'Trường CNTT & TT',
      instructor: instructor.trim() || departmentCode.trim() || 'Bộ môn phân công',
      credits: Number(credits) || 3,
      tuitionCredits: Number(tuitionCredits) || Number(credits) || 3,
      isCompulsory,
      allocation: allocation.trim() || `${credits}(2-1-0-6)`,
      semester: semester.trim() || '20261',
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
          {/* Mã học phần & Tên học phần (Bắt buộc theo CSDL hoc_phan) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Mã học phần *</label>
              <Input
                required
                placeholder="VD: IT3040"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tên học phần *</label>
              <Input
                required
                placeholder="VD: Kỹ thuật phần mềm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Khoa/Viện quản lý (truong) & Giảng viên phụ trách */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Khoa / Viện quản lý</label>
              <Input
                placeholder="VD: Trường CNTT & TT"
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Giảng viên phụ trách</label>
              <Input
                placeholder="VD: TS. Nguyễn Thu Hường"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>
          </div>

          {/* Tín chỉ học tập, Tín chỉ học phí, Tính chất học phần */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">TC học tập *</label>
              <Input
                type="number"
                min={1}
                max={12}
                value={credits}
                onChange={(e) => handleCreditsChange(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">TC học phí</label>
              <Input
                type="number"
                min={1}
                max={12}
                value={tuitionCredits}
                onChange={(e) => setTuitionCredits(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Tính chất</label>
              <select
                value={isCompulsory ? 'compulsory' : 'elective'}
                onChange={(e) => setIsCompulsory(e.target.value === 'compulsory')}
                className="w-full rounded-md border bg-background px-2 py-2 text-xs shadow-xs focus:ring-1 focus:ring-ring"
              >
                <option value="compulsory">Bắt buộc</option>
                <option value="elective">Tự chọn</option>
              </select>
            </div>
          </div>

          {/* Phân bổ giờ học, Học kỳ, Trạng thái */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Phân bổ (LT-BT-TH-Tự học)</label>
              <Input
                placeholder="3(2-1-0-6)"
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Học kỳ</label>
              <Input
                placeholder="VD: 20261"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full rounded-md border bg-background px-2 py-2 text-xs shadow-xs focus:ring-1 focus:ring-ring"
              >
                <option value="active">Đang học (Active)</option>
                <option value="upcoming">Sắp mở (Upcoming)</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Schedule section */}
          <div className="rounded-xl border p-3 bg-muted/30 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lịch học & Phòng (Lớp học phần)
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
            <label className="text-xs font-semibold text-muted-foreground">Mô tả / Đề cương tóm tắt</label>
            <textarea
              rows={2}
              className="w-full rounded-md border bg-background p-2 text-sm shadow-xs focus:ring-1 focus:ring-ring"
              placeholder="Tóm tắt đề cương, yêu cầu và nội dung học tập..."
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
