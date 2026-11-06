import type { Assignment, AssignmentPriority, AssignmentStatus } from '@/types/student'

export interface ApiAssignmentRaw {
  id?: number | string
  mabt?: number | string
  course_id?: string
  courseId?: string
  malh?: number | string
  class_code?: string
  classCode?: string
  title?: string
  tieu_de?: string
  description?: string
  noi_dung?: string
  due_date?: string
  dueDate?: string
  deadline?: string | Date
  priority?: string
  muc_do_uu_tien?: string
  status?: string
  trang_thai?: string
  estimated_hours?: number
  estimatedHours?: number
  created_at?: string
  createdAt?: string
}

/**
 * Chuyển đổi trạng thái bài tập
 */
export const normalizeAssignmentStatus = (raw: unknown): AssignmentStatus => {
  const str = String(raw || '').toLowerCase()
  if (str.includes('comp') || str.includes('hoan_thanh') || str.includes('da_nop') || str === 'done') {
    return 'completed'
  }
  if (str.includes('prog') || str.includes('dang_lam') || str.includes('doing')) {
    return 'in_progress'
  }
  return 'pending'
}

/**
 * Chuyển đổi mức độ ưu tiên
 */
export const normalizeAssignmentPriority = (raw: unknown): AssignmentPriority => {
  const str = String(raw || '').toLowerCase()
  if (str.includes('high') || str.includes('cao') || str === 'gap') {
    return 'high'
  }
  if (str.includes('low') || str.includes('thap')) {
    return 'low'
  }
  return 'medium'
}

/**
 * Chuyển đổi một bản ghi bài tập thô sang Assignment ViewModel
 */
export const adaptAssignmentRawToViewModel = (raw: ApiAssignmentRaw): Assignment => {
  const id = String(raw.id || raw.mabt || `assign-${Math.random()}`)
  const courseId = String(raw.courseId || raw.course_id || raw.malh || raw.classCode || raw.class_code || 'HP000')
  const title = raw.title || raw.tieu_de || 'Bài tập không tên'
  const description = raw.description || raw.noi_dung || ''

  let dueDate = ''
  const rawDue = raw.dueDate || raw.due_date || raw.deadline
  if (rawDue) {
    if (rawDue instanceof Date) {
      dueDate = rawDue.toISOString()
    } else {
      dueDate = String(rawDue)
    }
  } else {
    // Default 7 days from now
    const d = new Date()
    d.setDate(d.getDate() + 7)
    dueDate = d.toISOString()
  }

  const priority = normalizeAssignmentPriority(raw.priority || raw.muc_do_uu_tien)
  const status = normalizeAssignmentStatus(raw.status || raw.trang_thai)
  const estimatedHours = Number(raw.estimatedHours ?? raw.estimated_hours ?? 3)
  const createdAt = raw.createdAt || raw.created_at || new Date().toISOString()

  return {
    id,
    courseId,
    title,
    description,
    dueDate,
    priority,
    status,
    estimatedHours,
    createdAt,
  }
}

/**
 * Xử lý danh sách bài tập trả về từ API
 */
export const adaptAssignmentsListResponse = (response: unknown): Assignment[] => {
  if (!response) return []

  let rawList: ApiAssignmentRaw[] = []

  if (Array.isArray(response)) {
    rawList = response
  } else if (typeof response === 'object' && response !== null) {
    const obj = response as Record<string, unknown>
    if (Array.isArray(obj.items)) {
      rawList = obj.items as ApiAssignmentRaw[]
    } else if (Array.isArray(obj.data)) {
      rawList = obj.data as ApiAssignmentRaw[]
    }
  }

  return rawList.map(adaptAssignmentRawToViewModel)
}

/**
 * Chuyển đổi từ ViewModel khi tạo hoặc sửa bài tập gửi về Backend API
 */
export const adaptViewModelToAssignmentPayload = (
  data: Partial<Assignment>,
): Record<string, unknown> => {
  return {
    tieu_de: data.title,
    noi_dung: data.description,
    deadline: data.dueDate,
    muc_do_uu_tien: data.priority,
    trang_thai: data.status,
    malh: data.courseId ? Number(data.courseId) || undefined : undefined,
    // Đồng thời giữ các trường camelCase cho API Express đa dạng
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status,
    courseId: data.courseId,
    estimatedHours: data.estimatedHours,
  }
}

