import { useState, useEffect, useMemo } from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Calculator,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useUpdateGradeRecord } from '@/hooks/useGrades'
import { useToast } from '@/components/shared'
import { calculateGradeDetail } from '@/lib/score.utils'
import type { Course, GradeRecord } from '@/types/student'

const DAY_LABELS: Record<string, string> = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ Nhật',
}

interface CourseGradeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
  grade?: GradeRecord | null
  onNavigateToGrades?: () => void
}

export function CourseGradeDetailModal({
  isOpen,
  onClose,
  course,
  grade,
  onNavigateToGrades,
}: CourseGradeDetailModalProps) {
  const { toast } = useToast()
  const updateGradeMutation = useUpdateGradeRecord()

  const [attendanceScore, setAttendanceScore] = useState<number>(0)
  const [midtermScore, setMidtermScore] = useState<number>(0)
  const [practicalScore, setPracticalScore] = useState<number>(0)
  const [finalExamScore, setFinalExamScore] = useState<number>(0)
  const [trongSoQt, setTrongSoQt] = useState<number>(0.4)

  useEffect(() => {
    if (grade) {
      setAttendanceScore(grade.attendanceScore ?? 0)
      setMidtermScore(grade.midtermScore ?? 0)
      setPracticalScore(grade.practicalScore ?? 0)
      setFinalExamScore(grade.finalExamScore ?? 0)
      setTrongSoQt(grade.trongSoQt ?? 0.4)
    } else {
      setAttendanceScore(0)
      setMidtermScore(0)
      setPracticalScore(0)
      setFinalExamScore(0)
      setTrongSoQt(0.4)
    }
  }, [grade, isOpen])

  const calculated = useMemo(() => {
    return calculateGradeDetail(
      attendanceScore,
      midtermScore,
      practicalScore,
      finalExamScore,
      trongSoQt,
    )
  }, [attendanceScore, midtermScore, practicalScore, finalExamScore, trongSoQt])

  if (!isOpen || !course) return null

  const isPassed = calculated.overallScore >= 4.0 && calculated.diemCk >= 3.0

  const handleScoreChange = (setter: (val: number) => void, valStr: string) => {
    let num = parseFloat(valStr)
    if (isNaN(num)) num = 0
    if (num < 0) num = 0
    if (num > 10) num = 10
    setter(Math.round(num * 10) / 10)
  }

  const handleSave = () => {
    const targetId = grade?.id || course.id
    updateGradeMutation.mutate(
      {
        id: targetId,
        scores: {
          attendanceScore,
          midtermScore,
          practicalScore,
          finalExamScore,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật điểm học phần "${course.name}" thành công!`)
          onClose()
        },
        onError: () => {
          toast.error('Cập nhật điểm thất bại. Vui lòng thử lại.')
        },
      },
    )
  }

  const getBadgeStyle = (letter: string) => {
    if (letter.startsWith('A')) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
    if (letter.startsWith('B')) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
    if (letter.startsWith('C')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
    if (letter.startsWith('D')) return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30'
    return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs font-bold bg-muted/60">
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
              <span className="text-xs text-muted-foreground">• {course.credits} Tín chỉ</span>
            </div>
            <h2 className="text-xl font-bold text-foreground leading-tight">{course.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Đơn vị: {course.departmentCode || course.instructor}</span>
              <span>•</span>
              <span>Học kỳ: {course.semester}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Grade Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-3 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Tổng kết hệ 10
            </span>
            <div className="text-2xl font-black text-primary">
              {calculated.overallScore.toFixed(1)}
              <span className="text-xs font-normal text-muted-foreground">/10</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              QT: {calculated.diemQt.toFixed(1)} | CK: {calculated.diemCk.toFixed(1)}
            </div>
          </div>

          <div className="rounded-xl border p-3 space-y-1 bg-card">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Điểm chữ
            </span>
            <div>
              <Badge className={`text-base font-extrabold px-2.5 py-0.5 border ${getBadgeStyle(calculated.letterGrade)}`}>
                {calculated.letterGrade}
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {calculated.letterGrade.startsWith('A')
                ? 'Giỏi / Xuất sắc'
                : calculated.letterGrade.startsWith('B')
                ? 'Khá'
                : calculated.letterGrade.startsWith('C')
                ? 'Trung bình'
                : calculated.letterGrade.startsWith('D')
                ? 'Đạt'
                : 'Chưa đạt (Học lại)'}
            </div>
          </div>

          <div className="rounded-xl border p-3 space-y-1 bg-card">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Thang 4 (GPA)
            </span>
            <div className="text-2xl font-black text-foreground">
              {calculated.gpaScore.toFixed(2)}
              <span className="text-xs font-normal text-muted-foreground">/4.0</span>
            </div>
            <div className="text-[11px] text-muted-foreground">Quy đổi chuẩn HUST</div>
          </div>

          <div
            className={`rounded-xl border p-3 space-y-1 ${
              isPassed
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider">Kết quả học phần</span>
            <div className="flex items-center gap-1.5 text-base font-bold">
              {isPassed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Đạt học phần
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" /> Học lại
                </>
              )}
            </div>
            <div className="text-[11px] opacity-90">
              {calculated.diemCk < 3.0 ? 'Điểm liệt cuối kỳ (<3.0)' : isPassed ? 'Tích lũy tín chỉ' : 'Điểm tổng kết < 4.0'}
            </div>
          </div>
        </div>

        {/* Form nhập điểm chi tiết thành phần */}
        <div className="rounded-xl border p-4 bg-muted/20 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Nhập điểm thành phần & Tính toán</h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Trọng số QT:</span>
              <select
                value={trongSoQt}
                onChange={(e) => setTrongSoQt(Number(e.target.value))}
                className="rounded-md border bg-background px-2 py-1 text-xs font-medium"
              >
                <option value={0.3}>30% QT - 70% CK</option>
                <option value={0.4}>40% QT - 60% CK (Chuẩn)</option>
                <option value={0.5}>50% QT - 50% CK</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Chuyên cần */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-foreground">Chuyên cần</label>
                <span className="text-muted-foreground text-[10px]">20% QT</span>
              </div>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={attendanceScore || ''}
                placeholder="0.0"
                onChange={(e) => handleScoreChange(setAttendanceScore, e.target.value)}
                className="font-mono text-center font-bold text-sm h-9"
              />
            </div>

            {/* Giữa kỳ */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-foreground">Giữa kỳ</label>
                <span className="text-muted-foreground text-[10px]">40% QT</span>
              </div>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={midtermScore || ''}
                placeholder="0.0"
                onChange={(e) => handleScoreChange(setMidtermScore, e.target.value)}
                className="font-mono text-center font-bold text-sm h-9"
              />
            </div>

            {/* Thực hành / Bài tập lớn */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-foreground">Bài tập / TH</label>
                <span className="text-muted-foreground text-[10px]">40% QT</span>
              </div>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={practicalScore || ''}
                placeholder="0.0"
                onChange={(e) => handleScoreChange(setPracticalScore, e.target.value)}
                className="font-mono text-center font-bold text-sm h-9"
              />
            </div>

            {/* Thi cuối kỳ */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-primary">Cuối kỳ *</label>
                <span className="text-muted-foreground text-[10px]">
                  {Math.round((1 - trongSoQt) * 100)}% HP
                </span>
              </div>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={finalExamScore || ''}
                placeholder="0.0"
                onChange={(e) => handleScoreChange(setFinalExamScore, e.target.value)}
                className="font-mono text-center font-black text-sm h-9 border-primary/40 focus:border-primary"
              />
            </div>
          </div>

          {/* Quick slider / helper */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>
              Công thức:{' '}
              <span className="font-mono font-medium text-foreground">
                ({calculated.diemQt.toFixed(1)} × {trongSoQt}) + ({calculated.diemCk.toFixed(1)} ×{' '}
                {(1 - trongSoQt).toFixed(1)}) = {calculated.overallScore.toFixed(1)}
              </span>
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400">
              * Điểm thi cuối kỳ &lt; 3.0 sẽ bị điểm liệt (F)
            </span>
          </div>
        </div>

        {/* Course Schedule Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border rounded-xl p-3 bg-card text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Thứ: {DAY_LABELS[course.schedule.dayOfWeek] || course.schedule.dayOfWeek}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Ca: {course.schedule.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Phòng: {course.schedule.room}</span>
          </div>
          {course.description && (
            <div className="col-span-full pt-2 border-t text-xs italic text-muted-foreground/90">
              {course.description}
            </div>
          )}
        </div>

        {/* Quy chế quy đổi HUST */}
        <div className="flex items-start gap-2 rounded-xl bg-blue-500/10 p-3 text-xs text-blue-900 dark:text-blue-300">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
          <div className="space-y-0.5">
            <span className="font-semibold">Quy định tính điểm ĐHBK Hà Nội (HUST):</span>
            <p className="text-[11px] opacity-90 leading-relaxed">
              Điểm quá trình (QT) gồm Chuyên cần (20%), Giữa kỳ (40%), Thực hành/BTL (40%). Điểm học phần = QT × {trongSoQt} + CK × {(1 - trongSoQt).toFixed(1)}. Thang điểm chữ: A+ (≥9.0), A (8.5-8.9), B+ (8.0-8.4), B (7.0-7.9), C+ (6.5-6.9), C (5.5-6.4), D+ (5.0-5.4), D (4.0-4.9), F (&lt;4.0 hoặc CK &lt; 3.0).
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          {onNavigateToGrades ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onClose()
                onNavigateToGrades()
              }}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Xem toàn bộ Bảng điểm & GPA</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={updateGradeMutation.isPending}>
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={updateGradeMutation.isPending}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{updateGradeMutation.isPending ? 'Đang lưu...' : 'Lưu điểm học phần'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
