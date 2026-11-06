import { useState, useMemo, useCallback } from 'react'
import {
  useLegacyTable as useReactTable,
  getCoreRowModel,
  type LegacyColumnDef as ColumnDef,
} from '@tanstack/react-table/legacy'
import { flexRender } from '@tanstack/react-table'
import {
  Award,
  Edit2,
  Check,
  X,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared'
import { useGrades, useUpdateGradeRecord } from '@/hooks/useGrades'
import { useCourses } from '@/hooks/useCourses'
import { useStudyStats } from '@/hooks/useStudyStats'
import type { GradeRecord } from '@/types/student'

export function GradeTracker() {
  const { data: grades, isLoading, isFetching, error, refetch } = useGrades()
  const { data: courses } = useCourses()
  const { data: stats } = useStudyStats()
  const updateGradeMutation = useUpdateGradeRecord()

  const [editingGradeId, setEditingGradeId] = useState<string | null>(null)
  const [editScores, setEditScores] = useState({
    attendanceScore: 0,
    midtermScore: 0,
    practicalScore: 0,
    finalExamScore: 0,
  })

  const courseMap = useMemo(() => new Map(courses?.map((c) => [c.id, c])), [courses])

  const handleStartEdit = useCallback((grade: GradeRecord) => {
    setEditingGradeId(grade.id)
    setEditScores({
      attendanceScore: grade.attendanceScore,
      midtermScore: grade.midtermScore,
      practicalScore: grade.practicalScore,
      finalExamScore: grade.finalExamScore,
    })
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingGradeId(null)
  }, [])

  const handleSaveEdit = useCallback((gradeId: string) => {
    updateGradeMutation.mutate(
      {
        id: gradeId,
        scores: {
          attendanceScore: Number(editScores.attendanceScore) || 0,
          midtermScore: Number(editScores.midtermScore) || 0,
          practicalScore: Number(editScores.practicalScore) || 0,
          finalExamScore: Number(editScores.finalExamScore) || 0,
        },
      },
      {
        onSuccess: () => setEditingGradeId(null),
      },
    )
  }, [editScores, updateGradeMutation])

  // TanStack Table columns definition
  const columns = useMemo<ColumnDef<GradeRecord>[]>(
    () => [
      {
        id: 'course',
        header: 'Môn Học',
        cell: ({ row }) => {
          const grade = row.original
          const course = courseMap.get(grade.courseId)
          return (
            <div>
              <div className="font-semibold text-foreground">
                {course?.name || grade.courseName || 'Môn học không xác định'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Badge variant="outline" className="font-mono text-[10px] py-0">
                  {course?.code || grade.courseCode || 'HP'}
                </Badge>
                <span>{course?.instructor || 'Bộ môn'}</span>
              </div>
            </div>
          )
        },
      },
      {
        id: 'credits',
        header: () => <div className="text-center">Tín Chỉ</div>,
        cell: ({ row }) => {
          const course = courseMap.get(row.original.courseId)
          return <div className="text-center font-medium">{course?.credits || row.original.credits || 0}</div>
        },
      },
      {
        id: 'attendance',
        header: () => <div className="text-center">Chuyên Cần (10%)</div>,
        cell: ({ row }) => {
          const grade = row.original
          const isEditing = editingGradeId === grade.id
          if (isEditing) {
            return (
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="h-8 w-16 text-center mx-auto text-xs"
                value={editScores.attendanceScore}
                onChange={(e) =>
                  setEditScores({
                    ...editScores,
                    attendanceScore: parseFloat(e.target.value) || 0,
                  })
                }
              />
            )
          }
          return <div className="text-center font-mono">{grade.attendanceScore.toFixed(1)}</div>
        },
      },
      {
        id: 'midterm',
        header: () => <div className="text-center">Giữa Kỳ (20%)</div>,
        cell: ({ row }) => {
          const grade = row.original
          const isEditing = editingGradeId === grade.id
          if (isEditing) {
            return (
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="h-8 w-16 text-center mx-auto text-xs"
                value={editScores.midtermScore}
                onChange={(e) =>
                  setEditScores({
                    ...editScores,
                    midtermScore: parseFloat(e.target.value) || 0,
                  })
                }
              />
            )
          }
          return <div className="text-center font-mono">{grade.midtermScore.toFixed(1)}</div>
        },
      },
      {
        id: 'practical',
        header: () => <div className="text-center">Thực Hành (20%)</div>,
        cell: ({ row }) => {
          const grade = row.original
          const isEditing = editingGradeId === grade.id
          if (isEditing) {
            return (
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="h-8 w-16 text-center mx-auto text-xs"
                value={editScores.practicalScore}
                onChange={(e) =>
                  setEditScores({
                    ...editScores,
                    practicalScore: parseFloat(e.target.value) || 0,
                  })
                }
              />
            )
          }
          return <div className="text-center font-mono">{grade.practicalScore.toFixed(1)}</div>
        },
      },
      {
        id: 'finalExam',
        header: () => <div className="text-center">Cuối Kỳ (50%)</div>,
        cell: ({ row }) => {
          const grade = row.original
          const isEditing = editingGradeId === grade.id
          if (isEditing) {
            return (
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="h-8 w-16 text-center mx-auto text-xs"
                value={editScores.finalExamScore}
                onChange={(e) =>
                  setEditScores({
                    ...editScores,
                    finalExamScore: parseFloat(e.target.value) || 0,
                  })
                }
              />
            )
          }
          return <div className="text-center font-mono">{grade.finalExamScore.toFixed(1)}</div>
        },
      },
      {
        id: 'overall',
        header: () => <div className="text-center">Điểm Hệ 10</div>,
        cell: ({ row }) => (
          <div className="text-center font-bold text-primary">
            {row.original.overallScore.toFixed(1)}
          </div>
        ),
      },
      {
        id: 'letterGrade',
        header: () => <div className="text-center">Điểm Chữ</div>,
        cell: ({ row }) => {
          const letter = row.original.letterGrade
          return (
            <div className="text-center">
              <Badge
                variant={
                  letter.startsWith('A')
                    ? 'default'
                    : letter.startsWith('B')
                    ? 'secondary'
                    : 'outline'
                }
                className="font-bold text-xs"
              >
                {letter}
              </Badge>
            </div>
          )
        },
      },
      {
        id: 'gpa',
        header: () => <div className="text-center">Điểm Hệ 4</div>,
        cell: ({ row }) => (
          <div className="text-center font-bold text-foreground">
            {row.original.gpaScore.toFixed(1)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Thao Tác</div>,
        cell: ({ row }) => {
          const grade = row.original
          const isEditing = editingGradeId === grade.id
          const isSaving =
            updateGradeMutation.isPending && updateGradeMutation.variables?.id === grade.id

          if (isEditing) {
            return (
              <div className="flex items-center justify-end gap-1">
                <Button
                  size="icon"
                  variant="default"
                  className="h-7 w-7"
                  disabled={isSaving}
                  onClick={() => handleSaveEdit(grade.id)}
                  title="Lưu điểm"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={handleCancelEdit}
                  title="Hủy"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          }

          return (
            <div className="text-right">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleStartEdit(grade)}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nhập điểm</span>
              </Button>
            </div>
          )
        },
      },
    ],
    [courseMap, editingGradeId, editScores, updateGradeMutation.isPending, updateGradeMutation.variables, handleSaveEdit, handleCancelEdit, handleStartEdit],
  )

  const tableData = useMemo(() => grades ?? [], [grades])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Academic standing label
  const getStandingLabel = (gpa4: number) => {
    if (gpa4 >= 3.6) return { text: 'Xuất sắc', color: 'text-emerald-500' }
    if (gpa4 >= 3.2) return { text: 'Giỏi', color: 'text-blue-500' }
    if (gpa4 >= 2.5) return { text: 'Khá', color: 'text-amber-500' }
    if (gpa4 >= 2.0) return { text: 'Trung bình', color: 'text-orange-500' }
    return { text: 'Yếu / Cần cải thiện', color: 'text-red-500' }
  }

  const standing = getStandingLabel(stats?.overallGpa4 || 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bảng Điểm & Theo Dõi GPA</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý điểm thành phần các môn học và tự động tính điểm trung bình tích lũy
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
          <span>Làm mới bảng điểm</span>
        </Button>
      </div>

      {/* GPA Summary Highlights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">GPA Hệ 4</span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.overallGpa4.toFixed(2) || '0.00'}{' '}
            <span className="text-sm font-normal text-muted-foreground">/ 4.0</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Xếp loại:{' '}
            <span className={`font-semibold ${standing.color}`}>{standing.text}</span>
          </p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 via-card to-card p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Điểm TB Hệ 10</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.overallGpa10.toFixed(2) || '0.00'}{' '}
            <span className="text-sm font-normal text-muted-foreground">/ 10</span>
          </div>
          <p className="text-xs text-muted-foreground">Trọng số theo tín chỉ từng môn</p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 via-card to-card p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Tín Chỉ Đào Tạo</span>
            <GraduationCap className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {stats?.totalCredits || 0}{' '}
            <span className="text-sm font-normal text-muted-foreground">Tín chỉ</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.completedCredits || 0} tín chỉ đã hoàn thành
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Info className="h-4 w-4 text-primary" />
            <span>Công thức tính điểm</span>
          </div>
          <p>
            Chuyên cần: <strong>10%</strong> | Thực hành/BTL: <strong>20%</strong>
          </p>
          <p>
            Giữa kỳ: <strong>20%</strong> | Thi cuối kỳ: <strong>50%</strong>
          </p>
          <p className="italic text-muted-foreground/80">
            Điểm GPA cập nhật tức thời qua TanStack Query invalidation.
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <ErrorState
          title="Không thể tải bảng điểm"
          message={error.message || 'Lỗi kết nối máy chủ khi lấy dữ liệu điểm số.'}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <LoadingState type="table" message="Đang tải dữ liệu điểm học phần từ hệ thống..." />
      )}

      {/* TanStack Table View */}
      {!isLoading && !error && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-4 font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y text-xs sm:text-sm">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      editingGradeId === row.original.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}

                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="p-0">
                      <EmptyState
                        title="Chưa có dữ liệu điểm học phần"
                        description="Học kỳ này chưa có điểm số nào được ghi nhận. Vui lòng đăng ký học phần trước."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
