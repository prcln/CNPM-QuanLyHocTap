import type { GradeRecord } from '@/types/student'
import { calculateHustGrade, calculateGradeDetail } from '../score.utils'

export interface ApiGradeRaw {
  madiem?: number | string
  id?: number | string
  masv?: number | string
  student_id?: number | string
  malh?: number | string
  class_code?: string
  classCode?: string
  mahp?: string
  course_id?: string
  courseId?: string
  course_name?: string
  courseName?: string
  credits?: number | string
  tin_chi?: number | string
  diem_qt?: number | string | null
  diemQt?: number | string | null
  diem_ck?: number | string | null
  diemCk?: number | string | null
  trongso_qt?: number | string | null
  trongsoQt?: number | string | null
  trongSoQt?: number | string | null
  attendance_score?: number | string | null
  attendanceScore?: number | string | null
  midterm_score?: number | string | null
  midtermScore?: number | string | null
  practical_score?: number | string | null
  practicalScore?: number | string | null
  final_exam_score?: number | string | null
  finalExamScore?: number | string | null
}

/**
 * Chuyển đổi dữ liệu điểm thô (từ bảng `diem` của Supabase hoặc ERD) sang ViewModel `GradeRecord`
 */
export const adaptGradeRawToViewModel = (
  raw: ApiGradeRaw,
  courseInfo?: { name?: string; code?: string; credits?: number },
): GradeRecord => {
  const id = String(raw.id || raw.madiem || `grade-${Math.random()}`)
  const courseId = String(raw.courseId || raw.course_id || raw.malh || raw.classCode || raw.class_code || raw.mahp || 'unknown')

  // Trọng số quá trình (chuẩn Guardrail 3: lấy từ lop_hoc.trongso_qt, mặc định 0.40)
  const trongSoQt = Number(raw.trongSoQt ?? raw.trongso_qt ?? 0.40)

  // Kiểm tra xem backend đã có điểm QT và CK chưa
  const hasQt = raw.diemQt !== undefined && raw.diemQt !== null
  const hasRawQt = raw.diem_qt !== undefined && raw.diem_qt !== null
  const hasCk = raw.diemCk !== undefined && raw.diemCk !== null
  const hasRawCk = raw.diem_ck !== undefined && raw.diem_ck !== null

  let diemQt = 0
  let diemCk = 0
  let attendanceScore = 0
  let midtermScore = 0
  let practicalScore = 0
  let finalExamScore = 0
  let overallScore = 0
  let gpaScore = 0
  let letterGrade = 'F'

  if (hasQt || hasRawQt || hasCk || hasRawCk) {
    diemQt = Number(raw.diemQt ?? raw.diem_qt ?? 0)
    diemCk = Number(raw.diemCk ?? raw.diem_ck ?? 0)

    // Tính điểm học phần theo chuẩn HUST
    const calc = calculateHustGrade(diemQt, diemCk, trongSoQt)
    overallScore = calc.diemHpSo
    gpaScore = calc.diemHp4
    letterGrade = calc.diemChu

    // Điền các trường tương thích ngược giao diện
    finalExamScore = diemCk
    attendanceScore = Number(raw.attendanceScore ?? raw.attendance_score ?? diemQt)
    midtermScore = Number(raw.midtermScore ?? raw.midterm_score ?? diemQt)
    practicalScore = Number(raw.practicalScore ?? raw.practical_score ?? diemQt)
  } else {
    // Trường hợp mock data hoặc giao diện cũ có 4 đầu điểm
    attendanceScore = Number(raw.attendanceScore ?? raw.attendance_score ?? 0)
    midtermScore = Number(raw.midtermScore ?? raw.midterm_score ?? 0)
    practicalScore = Number(raw.practicalScore ?? raw.practical_score ?? 0)
    finalExamScore = Number(raw.finalExamScore ?? raw.final_exam_score ?? 0)

    const calc = calculateGradeDetail(attendanceScore, midtermScore, practicalScore, finalExamScore, trongSoQt)
    overallScore = calc.overallScore
    gpaScore = calc.gpaScore
    letterGrade = calc.letterGrade
    diemQt = calc.diemQt
    diemCk = calc.diemCk
  }

  const courseName = courseInfo?.name || raw.courseName || raw.course_name
  const courseCode = courseInfo?.code || raw.mahp || raw.classCode || raw.class_code
  const credits = courseInfo?.credits || Number(raw.credits ?? raw.tin_chi ?? 3)

  return {
    id,
    courseId,
    courseName,
    courseCode,
    credits,
    diemQt,
    diemCk,
    trongSoQt,
    attendanceScore,
    midtermScore,
    practicalScore,
    finalExamScore,
    overallScore,
    gpaScore,
    letterGrade,
  }
}

/**
 * Xử lý danh sách điểm trả về từ API
 */
export const adaptGradesListResponse = (
  response: unknown,
  courseMap?: Map<string, { name?: string; code?: string; credits?: number }>,
): GradeRecord[] => {
  if (!response) return []

  let rawList: ApiGradeRaw[] = []

  if (Array.isArray(response)) {
    rawList = response
  } else if (typeof response === 'object' && response !== null) {
    const obj = response as Record<string, unknown>
    if (Array.isArray(obj.items)) {
      rawList = obj.items as ApiGradeRaw[]
    } else if (Array.isArray(obj.data)) {
      rawList = obj.data as ApiGradeRaw[]
    }
  }

  return rawList.map((item) => {
    const cId = String(item.courseId || item.course_id || item.malh || '')
    const info = courseMap?.get(cId)
    return adaptGradeRawToViewModel(item, info)
  })
}

/**
 * Chuyển đổi dữ liệu từ ViewModel khi người dùng sửa điểm gửi lên Backend API
 */
export const adaptViewModelToGradePayload = (
  scores: {
    diemQt?: number
    diemCk?: number
    attendanceScore?: number
    midtermScore?: number
    practicalScore?: number
    finalExamScore?: number
  },
): { diem_qt: number; diem_ck: number; attendance_score?: number; midterm_score?: number; practical_score?: number; final_exam_score?: number } => {
  let diemQt = scores.diemQt
  let diemCk = scores.diemCk ?? scores.finalExamScore ?? 0

  if (diemQt === undefined) {
    const att = Number(scores.attendanceScore || 0)
    const mid = Number(scores.midtermScore || 0)
    const prac = Number(scores.practicalScore || 0)
    diemQt = Math.round((att * 0.2 + mid * 0.4 + prac * 0.4) * 10) / 10
  }

  return {
    diem_qt: diemQt,
    diem_ck: diemCk,
    attendance_score: scores.attendanceScore,
    midterm_score: scores.midtermScore,
    practical_score: scores.practicalScore,
    final_exam_score: scores.finalExamScore,
  }
}
