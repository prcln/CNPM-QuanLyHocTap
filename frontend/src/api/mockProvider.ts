/**
 * Mock Provider abstraction.
 * Decouples the application from mockDb so that mockDb is completely optional
 * and safely removable if needed, without breaking compilation or runtime.
 */
import { getSimulatedLatency, setSimulatedLatency, sleep } from '@/lib/latency'
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

// Import mockDb from mock layer (preserved per Guardrail G1)
import { mockDb } from './mockDb'

export interface MockDbInterface {
  resetAll: () => void
  getCourses: (filters?: CourseFilters) => Course[]
  getCourseById: (id: string) => Course | undefined
  createCourse: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Course
  updateCourse: (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>) => Course
  deleteCourse: (id: string) => boolean
  getAssignments: (filters?: AssignmentFilters) => Assignment[]
  createAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => Assignment
  updateAssignment: (id: string, updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>) => Assignment
  toggleAssignmentStatus: (id: string) => Assignment
  deleteAssignment: (id: string) => boolean
  getGrades: () => GradeRecord[]
  updateGrade: (id: string, scores: any) => GradeRecord
  getStats: () => StudyStats
  getActivities: (category?: ActivityCategory | 'all', registeredOnly?: boolean) => ExtracurricularActivity[]
  toggleActivityRegistration: (id: string) => ExtracurricularActivity
  getDrlSummary: () => DrlSummary
}

const fallbackStub: MockDbInterface = {
  resetAll: () => {},
  getCourses: () => [],
  getCourseById: () => undefined,
  createCourse: (d) =>
    ({
      ...d,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }) as any,
  updateCourse: (id, u) => ({ ...u, id }) as any,
  deleteCourse: () => true,
  getAssignments: () => [],
  createAssignment: (d) => ({ ...d, id: String(Date.now()), createdAt: new Date().toISOString() }) as any,
  updateAssignment: (id, u) => ({ ...u, id }) as any,
  toggleAssignmentStatus: (id) => ({ id, status: 'completed' }) as any,
  deleteAssignment: () => true,
  getGrades: () => [],
  updateGrade: (id, s) => ({ id, ...s }) as any,
  getStats: () => ({
    totalCourses: 0,
    activeCourses: 0,
    totalCredits: 0,
    completedCredits: 0,
    overallGpa10: 0,
    overallGpa4: 0,
    totalAssignments: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    urgentDeadlinesCount: 0,
  }),
  getActivities: () => [],
  toggleActivityRegistration: (id) => ({ id, registered: true }) as any,
  getDrlSummary: () => ({
    totalDrl: 70,
    rank: 'Khá',
    nextRankTarget: 80,
    criteriaBreakdown: [],
  }),
}

export const getMockDb = (): MockDbInterface => {
  return mockDb || fallbackStub
}

export { getSimulatedLatency, setSimulatedLatency, sleep }

