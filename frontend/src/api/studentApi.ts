import { mockDb, sleep, getSimulatedLatency, setSimulatedLatency } from './mockDb'
import type {
  Course,
  Assignment,
  GradeRecord,
  StudyStats,
  CourseFilters,
  AssignmentFilters,
} from '@/types/student'

export const studentApi = {
  // Config & Administration. TODO: Replace with real stuffs later
  getLatency: (): number => getSimulatedLatency(),
  setLatency: (ms: number): void => setSimulatedLatency(ms),
  resetDatabase: async (): Promise<void> => {
    await sleep()
    mockDb.resetAll()
  },

  // Courses basic CRUD API
  courses: {
    getAll: async (filters?: CourseFilters): Promise<Course[]> => {
      await sleep()
      return mockDb.getCourses(filters)
    },

    getById: async (id: string): Promise<Course> => {
      await sleep()
      const course = mockDb.getCourseById(id)
      if (!course) {
        throw new Error(`Không tìm thấy môn học có ID: ${id}`)
      }
      return course
    },

    create: async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
      await sleep()
      return mockDb.createCourse(data)
    },

    update: async (
      id: string,
      updates: Partial<Omit<Course, 'id' | 'createdAt'>>,
    ): Promise<Course> => {
      await sleep()
      return mockDb.updateCourse(id, updates)
    },

    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      await sleep()
      const success = mockDb.deleteCourse(id)
      if (!success) {
        throw new Error(`Xóa môn học thất bại hoặc môn học không tồn tại`)
      }
      return { success: true, id }
    },
  },

  // Assignments basic CRUD API
  assignments: {
    getAll: async (filters?: AssignmentFilters): Promise<Assignment[]> => {
      await sleep()
      return mockDb.getAssignments(filters)
    },

    create: async (data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> => {
      await sleep()
      return mockDb.createAssignment(data)
    },

    update: async (
      id: string,
      updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>,
    ): Promise<Assignment> => {
      await sleep()
      return mockDb.updateAssignment(id, updates)
    },

    toggleStatus: async (id: string): Promise<Assignment> => {
      await sleep()
      return mockDb.toggleAssignmentStatus(id)
    },

    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      await sleep()
      const success = mockDb.deleteAssignment(id)
      if (!success) {
        throw new Error(`Xóa bài tập thất bại hoặc bài tập không tồn tại`)
      }
      return { success: true, id }
    },
  },

  // Grades API
  grades: {
    getAll: async (): Promise<GradeRecord[]> => {
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
      await sleep()
      return mockDb.updateGrade(id, scores)
    },
  },

  // Study Stats API
  stats: {
    getOverview: async (): Promise<StudyStats> => {
      await sleep()
      return mockDb.getStats()
    },
  },
}
