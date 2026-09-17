import type { Course, Assignment, GradeRecord, StudyStats, CourseFilters, AssignmentFilters } from '@/types/student'
import { INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_GRADES } from './mock/mockData'
import { calculateGradeDetail } from '@/lib/score.utils'

const STORAGE_KEY = 'cnpm_qlht_store_v1'
const LATENCY_KEY = 'cnpm_qlht_latency_ms'

interface DbSchema {
  courses: Course[]
  assignments: Assignment[]
  grades: GradeRecord[]
}

// In-memory fallback
let inMemoryDb: DbSchema = {
  courses: [...INITIAL_COURSES],
  assignments: [...INITIAL_ASSIGNMENTS],
  grades: [...INITIAL_GRADES],
}

// Latency management
export const getSimulatedLatency = (): number => {
  if (typeof window === 'undefined') return 300
  const saved = localStorage.getItem(LATENCY_KEY)
  return saved !== null ? parseInt(saved, 10) : 400
}

export const setSimulatedLatency = (ms: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LATENCY_KEY, ms.toString())
  }
}

export const sleep = (ms = getSimulatedLatency()): Promise<void> => {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const loadDb = (): DbSchema => {
  if (typeof window === 'undefined') return inMemoryDb
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveDb(inMemoryDb)
      return inMemoryDb
    }
    return JSON.parse(raw) as DbSchema
  } catch (err) {
    console.error('Failed to load database from localStorage, falling back to memory', err)
    return inMemoryDb
  }
}

const saveDb = (db: DbSchema): void => {
  inMemoryDb = db
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    } catch (err) {
      console.error('Failed to persist database to localStorage', err)
    }
  }
}

export const mockDb = {
  // Reset all to initial state
  resetAll: (): void => {
    const fresh: DbSchema = {
      courses: JSON.parse(JSON.stringify(INITIAL_COURSES)),
      assignments: JSON.parse(JSON.stringify(INITIAL_ASSIGNMENTS)),
      grades: JSON.parse(JSON.stringify(INITIAL_GRADES)),
    }
    saveDb(fresh)
  },

  // Courses CRUD
  getCourses: (filters?: CourseFilters): Course[] => {
    const db = loadDb()
    let list = [...db.courses]

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.schedule.room.toLowerCase().includes(q),
      )
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((c) => c.status === filters.status)
    }

    if (filters?.semester && filters.semester !== 'all') {
      list = list.filter((c) => c.semester === filters.semester)
    }

    return list
  },

  getCourseById: (id: string): Course | undefined => {
    const db = loadDb()
    return db.courses.find((c) => c.id === id)
  },

  createCourse: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course => {
    const db = loadDb()
    const now = new Date().toISOString()
    const newCourse: Course = {
      ...data,
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    }

    // Automatically create a default grade record for this course
    const { overallScore, gpaScore, letterGrade } = calculateGradeDetail(0, 0, 0, 0)
    const newGrade: GradeRecord = {
      id: `g-${newCourse.id}`,
      courseId: newCourse.id,
      attendanceScore: 0,
      midtermScore: 0,
      practicalScore: 0,
      finalExamScore: 0,
      overallScore,
      gpaScore,
      letterGrade,
    }

    db.courses.unshift(newCourse)
    db.grades.unshift(newGrade)
    saveDb(db)
    return newCourse
  },

  updateCourse: (id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>): Course => {
    const db = loadDb()
    const index = db.courses.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error(`Course with ID ${id} not found`)
    }

    const updated: Course = {
      ...db.courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    db.courses[index] = updated
    saveDb(db)
    return updated
  },

  deleteCourse: (id: string): boolean => {
    const db = loadDb()
    const initialLen = db.courses.length
    db.courses = db.courses.filter((c) => c.id !== id)
    // Clean up related assignments and grades
    db.assignments = db.assignments.filter((a) => a.courseId !== id)
    db.grades = db.grades.filter((g) => g.courseId !== id)
    saveDb(db)
    return db.courses.length < initialLen
  },

  // Assignments CRUD
  getAssignments: (filters?: AssignmentFilters): Assignment[] => {
    const db = loadDb()
    let list = [...db.assignments]

    if (filters?.courseId && filters.courseId !== 'all') {
      list = list.filter((a) => a.courseId === filters.courseId)
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter((a) => a.status === filters.status)
    }

    if (filters?.priority && filters.priority !== 'all') {
      list = list.filter((a) => a.priority === filters.priority)
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim()
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)),
      )
    }

    // Sort by due date ascending
    list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    return list
  },

  createAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>): Assignment => {
    const db = loadDb()
    const newAssignment: Assignment = {
      ...data,
      id: `a-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    }
    db.assignments.unshift(newAssignment)
    saveDb(db)
    return newAssignment
  },

  updateAssignment: (id: string, updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>): Assignment => {
    const db = loadDb()
    const index = db.assignments.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error(`Assignment with ID ${id} not found`)
    }
    const updated: Assignment = {
      ...db.assignments[index],
      ...updates,
    }
    db.assignments[index] = updated
    saveDb(db)
    return updated
  },

  toggleAssignmentStatus: (id: string): Assignment => {
    const db = loadDb()
    const index = db.assignments.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error(`Assignment with ID ${id} not found`)
    }
    const current = db.assignments[index]
    const nextStatus = current.status === 'completed' ? 'pending' : 'completed'
    db.assignments[index] = { ...current, status: nextStatus }
    saveDb(db)
    return db.assignments[index]
  },

  deleteAssignment: (id: string): boolean => {
    const db = loadDb()
    const initialLen = db.assignments.length
    db.assignments = db.assignments.filter((a) => a.id !== id)
    saveDb(db)
    return db.assignments.length < initialLen
  },

  // Grades
  getGrades: (): GradeRecord[] => {
    const db = loadDb()
    return db.grades
  },

  updateGrade: (
    id: string,
    scores: {
      attendanceScore: number
      midtermScore: number
      practicalScore: number
      finalExamScore: number
    },
  ): GradeRecord => {
    const db = loadDb()
    const index = db.grades.findIndex((g) => g.id === id)
    if (index === -1) {
      throw new Error(`GradeRecord with ID ${id} not found`)
    }
    const calculated = calculateGradeDetail(
      scores.attendanceScore,
      scores.midtermScore,
      scores.practicalScore,
      scores.finalExamScore,
    )
    const updated: GradeRecord = {
      ...db.grades[index],
      ...scores,
      ...calculated,
    }
    db.grades[index] = updated
    saveDb(db)
    return updated
  },

  // Stats calculation
  getStats: (): StudyStats => {
    const db = loadDb()
    const now = new Date().getTime()
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000

    const totalCourses = db.courses.length
    const activeCourses = db.courses.filter((c) => c.status === 'active').length
    const totalCredits = db.courses.reduce((sum, c) => sum + c.credits, 0)
    const completedCredits = db.courses
      .filter((c) => c.status === 'completed')
      .reduce((sum, c) => sum + c.credits, 0)

    const totalAssignments = db.assignments.length
    const completedAssignments = db.assignments.filter((a) => a.status === 'completed').length
    const pendingAssignments = totalAssignments - completedAssignments

    const urgentDeadlinesCount = db.assignments.filter((a) => {
      if (a.status === 'completed') return false
      const dueTime = new Date(a.dueDate).getTime()
      return dueTime > now && dueTime - now <= threeDaysMs
    }).length

    // Calculate GPA weighted by course credits
    let totalScoreWeighted = 0
    let totalGpaWeighted = 0
    let evaluatedCredits = 0

    db.courses.forEach((c) => {
      const grade = db.grades.find((g) => g.courseId === c.id)
      if (grade && grade.overallScore > 0) {
        totalScoreWeighted += grade.overallScore * c.credits
        totalGpaWeighted += grade.gpaScore * c.credits
        evaluatedCredits += c.credits
      }
    })

    const overallGpa10 = evaluatedCredits > 0 ? Math.round((totalScoreWeighted / evaluatedCredits) * 100) / 100 : 0
    const overallGpa4 = evaluatedCredits > 0 ? Math.round((totalGpaWeighted / evaluatedCredits) * 100) / 100 : 0

    return {
      totalCourses,
      activeCourses,
      totalCredits,
      completedCredits,
      overallGpa10,
      overallGpa4,
      totalAssignments,
      pendingAssignments,
      completedAssignments,
      urgentDeadlinesCount,
    }
  },
}
