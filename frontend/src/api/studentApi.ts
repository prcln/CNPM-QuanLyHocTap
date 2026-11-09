import { getMockDb, sleep, getSimulatedLatency, setSimulatedLatency } from './mockProvider'
import { apiClient } from './client'
import {
  adaptCoursesListResponse,
  adaptCourseRawToViewModel,
  adaptViewModelToCoursePayload,
  adaptGradesListResponse,
  adaptGradeRawToViewModel,
  adaptViewModelToGradePayload,
  adaptAssignmentsListResponse,
  adaptAssignmentRawToViewModel,
  adaptViewModelToAssignmentPayload,
} from '@/lib/adapters'
import type {
  Course,
  Assignment,
  GradeRecord,
  StudyStats,
  CourseFilters,
  AssignmentFilters,
  ExtracurricularActivity,
  DrlSummary,
  ActivityCategory,
} from '@/types/student'

export const studentApi = {
  // Config & Administration
  getLatency: (): number => getSimulatedLatency(),
  setLatency: (ms: number): void => setSimulatedLatency(ms),
  resetDatabase: async (): Promise<void> => {
    await sleep()
    getMockDb().resetAll()
  },

  // Courses basic CRUD API (Compatible with API Contract /courses)
  courses: {
    getAll: async (filters?: CourseFilters): Promise<Course[]> => {
      if (apiClient.getMode() === 'backend') {
        const queryParams = new URLSearchParams()
        if (filters?.search) queryParams.set('search', filters.search)
        if (filters?.semester) queryParams.set('semester', filters.semester)
        const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''

        const res = await apiClient.request<unknown>(`/courses${qs}`)
        return adaptCoursesListResponse(res)
      }
      await sleep()
      return getMockDb().getCourses(filters)
    },

    getById: async (id: string): Promise<Course> => {
      if (apiClient.getMode() === 'backend') {
        const res = await apiClient.request<{ data: unknown } | unknown>(`/courses/${id}`)
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptCourseRawToViewModel(raw as any)
        throw new Error(`Không tìm thấy môn học có ID: ${id}`)
      }
      await sleep()
      const course = getMockDb().getCourseById(id)
      if (!course) {
        throw new Error(`Không tìm thấy môn học có ID: ${id}`)
      }
      return course
    },

    create: async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
      if (apiClient.getMode() === 'backend') {
        const payload = adaptViewModelToCoursePayload(data)
        const res = await apiClient.request<{ data: unknown } | unknown>('/courses', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptCourseRawToViewModel(raw as any)
        throw new Error('Tạo học phần mới thất bại')
      }
      await sleep()
      return getMockDb().createCourse(data)
    },

    update: async (
      id: string,
      updates: Partial<Omit<Course, 'id' | 'createdAt'>>,
    ): Promise<Course> => {
      if (apiClient.getMode() === 'backend') {
        const payload = adaptViewModelToCoursePayload(updates)
        const res = await apiClient.request<{ data: unknown } | unknown>(`/courses/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptCourseRawToViewModel(raw as any)
        throw new Error(`Cập nhật môn học ${id} thất bại`)
      }
      await sleep()
      return getMockDb().updateCourse(id, updates)
    },

    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      if (apiClient.getMode() === 'backend') {
        await apiClient.request(`/courses/${id}`, { method: 'DELETE' })
        return { success: true, id }
      }
      await sleep()
      const success = getMockDb().deleteCourse(id)
      if (!success) {
        throw new Error(`Xóa môn học thất bại hoặc môn học không tồn tại`)
      }
      return { success: true, id }
    },
  },

  // Assignments basic CRUD API (Compatible with API Contract /assignments)
  assignments: {
    getAll: async (filters?: AssignmentFilters): Promise<Assignment[]> => {
      if (apiClient.getMode() === 'backend') {
        const params = new URLSearchParams()
        if (filters?.courseId && filters.courseId !== 'all') params.append('malh', filters.courseId)
        if (filters?.search) params.append('search', filters.search)
        const qs = params.toString() ? `?${params.toString()}` : ''
        const res = await apiClient.request<unknown>(`/assignments${qs}`)
        return adaptAssignmentsListResponse(res)
      }
      await sleep()
      return getMockDb().getAssignments(filters)
    },

    create: async (data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> => {
      if (apiClient.getMode() === 'backend') {
        const payload = adaptViewModelToAssignmentPayload(data)
        const res = await apiClient.request<{ data: unknown } | unknown>('/assignments', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptAssignmentRawToViewModel(raw as any)
        throw new Error('Tạo bài tập thất bại')
      }
      await sleep()
      return getMockDb().createAssignment(data)
    },

    update: async (
      id: string,
      updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>,
    ): Promise<Assignment> => {
      if (apiClient.getMode() === 'backend') {
        const payload = adaptViewModelToAssignmentPayload(updates)
        const res = await apiClient.request<{ data: unknown } | unknown>(`/assignments/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptAssignmentRawToViewModel(raw as any)
        throw new Error(`Cập nhật bài tập ${id} thất bại`)
      }
      await sleep()
      return getMockDb().updateAssignment(id, updates)
    },

    toggleStatus: async (id: string): Promise<Assignment> => {
      if (apiClient.getMode() === 'backend') {
        const res = await apiClient.request<{ data: unknown } | unknown>(`/assignments/${id}/toggle-status`, {
          method: 'PATCH',
        })
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptAssignmentRawToViewModel(raw as any)
        throw new Error(`Đổi trạng thái bài tập ${id} thất bại`)
      }
      await sleep()
      return getMockDb().toggleAssignmentStatus(id)
    },

    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      if (apiClient.getMode() === 'backend') {
        await apiClient.request(`/assignments/${id}`, { method: 'DELETE' })
        return { success: true, id }
      }
      await sleep()
      const success = getMockDb().deleteAssignment(id)
      if (!success) {
        throw new Error(`Xóa bài tập thất bại hoặc bài tập không tồn tại`)
      }
      return { success: true, id }
    },
  },

  // Grades API (Compatible with API Contract /students/me/grades)
  grades: {
    getAll: async (): Promise<GradeRecord[]> => {
      if (apiClient.getMode() === 'backend') {
        const res = await apiClient.request<unknown>('/students/me/grades')
        return adaptGradesListResponse(res)
      }
      await sleep()
      return getMockDb().getGrades()
    },

    update: async (
      id: string,
      scores: {
        diemQt?: number
        diemCk?: number
        attendanceScore: number
        midtermScore: number
        practicalScore: number
        finalExamScore: number
      },
    ): Promise<GradeRecord> => {
      if (apiClient.getMode() === 'backend') {
        const payload = adaptViewModelToGradePayload(scores)
        const malh = Number(id.replace(/^g-/, '').replace(/^c-/, '')) || 1
        const res = await apiClient.request<{ data: unknown } | unknown>(`/students/me/grades/${malh}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
        if (raw) return adaptGradeRawToViewModel(raw as any)
        throw new Error(`Cập nhật điểm cho lớp ${id} thất bại`)
      }
      await sleep()
      return getMockDb().updateGrade(id, scores)
    },
  },

  // Study Stats API
  stats: {
    getOverview: async (): Promise<StudyStats> => {
      if (apiClient.getMode() === 'backend') {
        const res = await apiClient.request<{ data: any } | any>('/students/me/stats')
        const raw = res && typeof res === 'object' && 'data' in res ? res.data : res
        if (raw) {
          return {
            totalCourses: Number(raw.totalCourses) || 0,
            activeCourses: Number(raw.activeCourses) || 0,
            totalCredits: Number(raw.totalCredits) || 0,
            completedCredits: Number(raw.completedCredits) || 0,
            overallGpa10: Number(raw.overallGpa10) || 0,
            overallGpa4: Number(raw.overallGpa4) || 0,
            totalAssignments: Number(raw.totalAssignments) || 0,
            pendingAssignments: Number(raw.pendingAssignments) || 0,
            completedAssignments: Number(raw.completedAssignments) || 0,
            urgentDeadlinesCount: Number(raw.urgentDeadlinesCount) || 0,
          }
        }
        throw new Error('Không thể lấy dữ liệu thống kê từ máy chủ')
      }
      await sleep()
      return getMockDb().getStats()
    },
  },

  // Extracurricular Activities & DRL API
  activities: {
    getAll: async (
      category?: ActivityCategory | 'all',
      registeredOnly?: boolean,
    ): Promise<ExtracurricularActivity[]> => {
      if (apiClient.getMode() === 'backend') {
        const params = new URLSearchParams()
        if (category && category !== 'all') params.append('category', category)
        if (registeredOnly) params.append('registeredOnly', 'true')
        const qs = params.toString() ? `?${params.toString()}` : ''
        const res = await apiClient.request<{ data: any[] } | any[]>(`/activities${qs}`)
        const items = Array.isArray(res) ? res : res && typeof res === 'object' && 'data' in res ? res.data : []
        return items as ExtracurricularActivity[]
      }
      await sleep()
      return getMockDb().getActivities(category, registeredOnly)
    },

    toggleRegister: async (id: string): Promise<ExtracurricularActivity> => {
      if (apiClient.getMode() === 'backend') {
        const res = await apiClient.request<{ data: any } | any>(`/activities/${id}/toggle`, {
          method: 'POST',
        })
        const raw = res && typeof res === 'object' && 'data' in res ? res.data : res
        return raw as ExtracurricularActivity
      }
      await sleep()
      return getMockDb().toggleActivityRegistration(id)
    },

    getDrlSummary: async (): Promise<DrlSummary> => {
      if (apiClient.getMode() === 'backend') {
        const res = await apiClient.request<{ data: any } | any>('/activities/drl-summary')
        const raw = res && typeof res === 'object' && 'data' in res ? res.data : res
        return raw as DrlSummary
      }
      await sleep()
      return getMockDb().getDrlSummary()
    },
  },
}
