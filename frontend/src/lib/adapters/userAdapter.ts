import type { AuthUser, UserRole } from '@/types/auth'

export interface ApiAccountRaw {
  matk?: number | string
  id?: number | string
  username: string
  role?: string
  created_at?: string
  createdAt?: string
}

export interface ApiStudentRaw {
  masv?: number | string
  student_id?: number | string
  studentId?: string
  hoten?: string
  full_name?: string
  fullName?: string
  gioi_tinh?: string
  gender?: string
  email?: string
  chuong_trinh?: string
  program?: string
  truong?: string
  faculty?: string
  lop?: string
  className?: string
  cpa?: number | string
}

export interface ApiLecturerRaw {
  magv?: number | string
  lecturer_id?: number | string
  lecturerId?: string
  hoten?: string
  full_name?: string
  fullName?: string
  gioi_tinh?: string
  email?: string
  truong?: string
  faculty?: string
}

/**
 * Chuyển đổi dữ liệu tài khoản và hồ sơ người dùng (từ Supabase /auth/me hoặc /students/me) sang AuthUser ViewModel
 */
export const adaptAccountAndProfileToUser = (
  account: ApiAccountRaw,
  profile?: ApiStudentRaw | ApiLecturerRaw | null,
  token?: string,
): AuthUser => {
  const matk = Number(account.matk || account.id) || undefined
  const username = account.username || 'user'
  const role = (account.role || 'SV') as UserRole

  let fullName = username
  let studentId: string | undefined
  let lecturerId: string | undefined
  let email: string | undefined
  let faculty: string | undefined

  if (profile) {
    fullName = profile.fullName || profile.full_name || profile.hoten || username
    email = profile.email

    if (role === 'SV') {
      const student = profile as ApiStudentRaw
      studentId = String(student.studentId || student.student_id || student.masv || '')
      faculty = student.faculty || student.truong || student.chuong_trinh
    } else if (role === 'GV') {
      const lecturer = profile as ApiLecturerRaw
      lecturerId = String(lecturer.lecturerId || lecturer.lecturer_id || lecturer.magv || '')
      faculty = lecturer.faculty || lecturer.truong
    } else {
      faculty = 'Phòng Đào Tạo & CNTT'
    }
  }

  return {
    matk,
    id: String(matk || username),
    username,
    role,
    fullName,
    studentId,
    lecturerId,
    email,
    faculty,
    token,
    createdAt: account.createdAt || account.created_at,
  }
}

