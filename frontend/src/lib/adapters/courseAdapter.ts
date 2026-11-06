import type { Course, CourseSchedule, CourseStatus } from '@/types/student'
import { adaptScheduleRawToViewModel, type ApiScheduleRaw } from './scheduleAdapter'

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
]

/**
 * Tạo màu sắc đại diện cố định theo mã môn
 */
export const getColorTagByCode = (code: string): string => {
  let hash = 0
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[index]
}

export interface ApiCourseRaw {
  id: string
  code?: string
  name_vi?: string
  nameVi?: string
  name_en?: string | null
  nameEn?: string | null
  name?: string
  instructor?: string
  ten_giang_vien?: string
  credit_code?: string | null
  creditCode?: string | null
  course_units?: number | string | null
  courseUnits?: number | string | null
  credits?: number | string | null
  tin_chi_dao_tao?: number | string | null
  tuition_units?: number | string | null
  tuitionUnits?: number | string | null
  exam_factor?: number | string | null
  examFactor?: number | string | null
  trongso_qt?: number | string | null
  semester?: string
  hoc_ky?: string
  status?: string
  trang_thai?: string
  description?: string
  noidung?: string
  department_code?: string
  departmentCode?: string
  truong?: string
  class_type?: string
  classType?: string
  loai?: string
  max_students?: number
  maxStudents?: number
  registered_students?: number
  registeredStudents?: number
  schedule?: ApiScheduleRaw | CourseSchedule
  schedules?: ApiScheduleRaw[]
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

/**
 * Chuyển đổi một bản ghi môn học thô từ Supabase/Express sang ViewModel Course của giao diện
 */
export const adaptCourseRawToViewModel = (raw: ApiCourseRaw): Course => {
  const code = raw.code || raw.id || 'HP000'
  const name = raw.name || raw.nameVi || raw.name_vi || 'Học phần không tên'
  const instructor = raw.instructor || raw.ten_giang_vien || 'Bộ môn phân công'

  const creditsRaw = raw.credits ?? raw.courseUnits ?? raw.course_units ?? raw.tin_chi_dao_tao ?? 3
  const credits = Math.round(Number(creditsRaw) || 3)

  const semester = raw.semester || raw.hoc_ky || 'HK2 2025-2026'

  // Trạng thái môn học
  let status: CourseStatus = 'active'
  const rawStatus = (raw.status || raw.trang_thai || '').toLowerCase()
  if (rawStatus.includes('up') || rawStatus.includes('sap') || rawStatus.includes('chua')) {
    status = 'upcoming'
  } else if (rawStatus.includes('comp') || rawStatus.includes('qua') || rawStatus.includes('xong')) {
    status = 'completed'
  }

  // Lịch học
  let schedule: CourseSchedule
  if (raw.schedules && raw.schedules.length > 0) {
    schedule = adaptScheduleRawToViewModel(raw.schedules[0])
  } else if (raw.schedule) {
    schedule = adaptScheduleRawToViewModel(raw.schedule as ApiScheduleRaw)
  } else {
    schedule = {
      dayOfWeek: 'Monday',
      timeSlot: '07:30 - 09:50',
      room: 'Chưa xếp phòng',
    }
  }

  const colorTag = getColorTagByCode(code)
  const description = raw.description || raw.noidung || raw.nameEn || raw.name_en || ''
  const createdAt = raw.createdAt || raw.created_at || new Date().toISOString()
  const updatedAt = raw.updatedAt || raw.updated_at || createdAt

  return {
    id: raw.id || code,
    code,
    name,
    instructor,
    credits,
    semester,
    status,
    schedule,
    colorTag,
    description,
    departmentCode: raw.departmentCode || raw.department_code || raw.truong,
    classType: raw.classType || raw.class_type || raw.loai,
    maxStudents: raw.maxStudents || raw.max_students,
    registeredStudents: raw.registeredStudents || raw.registered_students,
    createdAt,
    updatedAt,
  }
}

/**
 * Xử lý response danh sách trả về từ Backend (hỗ trợ phân trang { items, pagination }, { data }, hoặc mảng trực tiếp)
 */
export const adaptCoursesListResponse = (response: unknown): Course[] => {
  if (!response) return []

  let rawList: ApiCourseRaw[] = []

  if (Array.isArray(response)) {
    rawList = response
  } else if (typeof response === 'object' && response !== null) {
    const obj = response as Record<string, unknown>
    if (Array.isArray(obj.items)) {
      rawList = obj.items as ApiCourseRaw[]
    } else if (Array.isArray(obj.data)) {
      rawList = obj.data as ApiCourseRaw[]
    }
  }

  return rawList.map(adaptCourseRawToViewModel)
}

/**
 * Ánh xạ quan hệ Lớp học (ILopHoc) + Học phần (IHocPhan) + Lịch học (ILichHoc) theo ERD sang Course ViewModel
 */
export const adaptClassToCourseView = (
  lopHoc: Record<string, unknown>,
  hocPhan?: Record<string, unknown>,
  lichHoc?: Record<string, unknown>[],
): Course => {
  const code = String(hocPhan?.mahp || lopHoc.mahp || lopHoc.malop || 'HP000')
  const name = String(hocPhan?.ten || lopHoc.ten || `Lớp học ${lopHoc.malop || ''}`)
  const credits = Number(hocPhan?.tin_chi_dao_tao || 3)

  const scheduleRaw = lichHoc && lichHoc.length > 0 ? (lichHoc[0] as ApiScheduleRaw) : undefined
  const schedule = scheduleRaw
    ? adaptScheduleRawToViewModel(scheduleRaw)
    : {
        dayOfWeek: 'Monday' as const,
        timeSlot: '07:30 - 09:50',
        room: 'B1.04',
      }

  return {
    id: String(lopHoc.malh || lopHoc.classCode || code),
    code,
    name,
    instructor: String(lopHoc.instructor || lopHoc.magv || 'Bộ môn phân công'),
    credits,
    semester: String(lopHoc.hoc_ky || lopHoc.semester || 'HK2 2025-2026'),
    status: 'active',
    schedule,
    colorTag: getColorTagByCode(code),
    description: String(hocPhan?.noidung || ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

