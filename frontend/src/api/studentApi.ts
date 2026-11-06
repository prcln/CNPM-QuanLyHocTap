import { mockDb, sleep, getSimulatedLatency, setSimulatedLatency } from './mockDb'
import { apiClient } from './client'
import {
  adaptCoursesListResponse,
  adaptCourseRawToViewModel,
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
    mockDb.resetAll()
  },

  // Courses basic CRUD API (Compatible with API Contract /courses)
  courses: {
    getAll: async (filters?: CourseFilters): Promise<Course[]> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const queryParams = new URLSearchParams()
          if (filters?.search) queryParams.set('search', filters.search)
          if (filters?.semester) queryParams.set('semester', filters.semester)
          const qs = queryParams.toString() ? `?${queryParams.toString()}` : ''

          const res = await apiClient.request<unknown>(`/courses${qs}`)
          const list = adaptCoursesListResponse(res)
          if (list.length > 0) return list
        } catch {
          // Fallback to mock on network or 404/500 error
        }
      }
      await sleep()
      return mockDb.getCourses(filters)
    },

    getById: async (id: string): Promise<Course> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const res = await apiClient.request<{ data: unknown } | unknown>(`/courses/${id}`)
          const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
          if (raw) return adaptCourseRawToViewModel(raw as any)
        } catch {
          // Fallback
        }
      }
      await sleep()
      const course = mockDb.getCourseById(id)
      if (!course) {
        throw new Error(`Không tìm thấy môn học có ID: ${id}`)
      }
      return course
    },

    create: async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const res = await apiClient.request<{ data: unknown } | unknown>('/courses', {
            method: 'POST',
            body: JSON.stringify(data),
          })
          const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
          if (raw) return adaptCourseRawToViewModel(raw as any)
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.createCourse(data)
    },

    update: async (
      id: string,
      updates: Partial<Omit<Course, 'id' | 'createdAt'>>,
    ): Promise<Course> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const res = await apiClient.request<{ data: unknown } | unknown>(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          })
          const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
          if (raw) return adaptCourseRawToViewModel(raw as any)
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.updateCourse(id, updates)
    },

    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      if (apiClient.getMode() === 'backend') {
        try {
          await apiClient.request(`/courses/${id}`, { method: 'DELETE' })
          return { success: true, id }
        } catch {
          // Fallback
        }
      }
      await sleep()
      const success = mockDb.deleteCourse(id)
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
        try {
          const res = await apiClient.request<unknown>('/assignments')
          const list = adaptAssignmentsListResponse(res)
          if (list.length > 0) return list
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.getAssignments(filters)
    },

    create: async (data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const payload = adaptViewModelToAssignmentPayload(data)
          const res = await apiClient.request<{ data: unknown } | unknown>('/assignments', {
            method: 'POST',
            body: JSON.stringify(payload),
          })
          const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
          if (raw) return adaptAssignmentRawToViewModel(raw as any)
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.createAssignment(data)
    },

    update: async (
      id: string,
      updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>,
    ): Promise<Assignment> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const payload = adaptViewModelToAssignmentPayload(updates)
          const res = await apiClient.request<{ data: unknown } | unknown>(`/assignments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          })
          const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
          if (raw) return adaptAssignmentRawToViewModel(raw as any)
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.updateAssignment(id, updates)
    },

    toggleStatus: async (id: string): Promise<Assignment> => {
      await sleep()
      return mockDb.toggleAssignmentStatus(id)
    },

    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      if (apiClient.getMode() === 'backend') {
        try {
          await apiClient.request(`/assignments/${id}`, { method: 'DELETE' })
          return { success: true, id }
        } catch {
          // Fallback
        }
      }
      await sleep()
      const success = mockDb.deleteAssignment(id)
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
        try {
          const res = await apiClient.request<unknown>('/students/me/grades')
          const list = adaptGradesListResponse(res)
          if (list.length > 0) return list
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.getGrades()
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
        try {
          const payload = adaptViewModelToGradePayload(scores)
          const res = await apiClient.request<{ data: unknown } | unknown>(`/classes/${id}/grades`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          })
          const raw = res && typeof res === 'object' && 'data' in res ? (res as { data: unknown }).data : res
          if (raw) return adaptGradeRawToViewModel(raw as any)
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.updateGrade(id, scores)
    },
  },

  // Study Stats API
  stats: {
    getOverview: async (): Promise<StudyStats> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const res = await apiClient.request<{ data: StudyStats } | StudyStats>('/reports/students/me')
          if (res && typeof res === 'object' && 'data' in res && res.data) return res.data
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.getStats()
    },
  },

  // Extracurricular Activities & DRL API
  activities: {
    getAll: async (
      category?: ActivityCategory | 'all',
      registeredOnly?: boolean,
    ): Promise<ExtracurricularActivity[]> => {
      await sleep()
      return mockDb.getActivities(category, registeredOnly)
    },

    toggleRegister: async (id: string): Promise<ExtracurricularActivity> => {
      await sleep()
      return mockDb.toggleActivityRegistration(id)
    },

    getDrlSummary: async (): Promise<DrlSummary> => {
      await sleep()
      return mockDb.getDrlSummary()
    },
  },
}
