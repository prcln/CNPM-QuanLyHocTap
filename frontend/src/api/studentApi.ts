import { mockDb, sleep, getSimulatedLatency, setSimulatedLatency } from './mockDb'
import { apiClient } from './client'
import type {
  Course,
  Assignment,
  GradeRecord,
  StudyStats,
  CourseFilters,
  AssignmentFilters,
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
          const res = await apiClient.request<{ data: Course[] } | Course[]>('/courses')
          const list = Array.isArray(res) ? res : (res.data || [])
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
          const res = await apiClient.request<{ data: Course } | Course>(`/courses/${id}`)
          return ('data' in res && res.data) ? res.data : (res as Course)
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
          const res = await apiClient.request<{ data: Course } | Course>('/courses', {
            method: 'POST',
            body: JSON.stringify(data),
          })
          return ('data' in res && res.data) ? res.data : (res as Course)
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
          const res = await apiClient.request<{ data: Course } | Course>(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          })
          return ('data' in res && res.data) ? res.data : (res as Course)
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
          const res = await apiClient.request<{ data: Assignment[] } | Assignment[]>('/assignments')
          const list = Array.isArray(res) ? res : (res.data || [])
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
          const res = await apiClient.request<{ data: Assignment } | Assignment>('/assignments', {
            method: 'POST',
            body: JSON.stringify(data),
          })
          return ('data' in res && res.data) ? res.data : (res as Assignment)
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
          const res = await apiClient.request<{ data: Assignment } | Assignment>(`/assignments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          })
          return ('data' in res && res.data) ? res.data : (res as Assignment)
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
          const res = await apiClient.request<{ data: GradeRecord[] } | GradeRecord[]>('/students/me/grades')
          const list = Array.isArray(res) ? res : (res.data || [])
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
        attendanceScore: number
        midtermScore: number
        practicalScore: number
        finalExamScore: number
      },
    ): Promise<GradeRecord> => {
      if (apiClient.getMode() === 'backend') {
        try {
          const res = await apiClient.request<{ data: GradeRecord } | GradeRecord>(`/classes/${id}/grades`, {
            method: 'PUT',
            body: JSON.stringify(scores),
          })
          return ('data' in res && res.data) ? res.data : (res as GradeRecord)
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
          if ('data' in res && res.data) return res.data
        } catch {
          // Fallback
        }
      }
      await sleep()
      return mockDb.getStats()
    },
  },
}
