import type { CourseFilters, AssignmentFilters } from '@/types/student'

export const studentQueryKeys = {
  // Courses keys
  courses: {
    all: ['courses'] as const,
    lists: () => [...studentQueryKeys.courses.all, 'list'] as const,
    list: (filters?: CourseFilters) => [...studentQueryKeys.courses.lists(), filters ?? {}] as const,
    details: () => [...studentQueryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...studentQueryKeys.courses.details(), id] as const,
  },

  // Assignments keys
  assignments: {
    all: ['assignments'] as const,
    lists: () => [...studentQueryKeys.assignments.all, 'list'] as const,
    list: (filters?: AssignmentFilters) => [...studentQueryKeys.assignments.lists(), filters ?? {}] as const,
    detail: (id: string) => [...studentQueryKeys.assignments.all, 'detail', id] as const,
  },

  // Grades keys
  grades: {
    all: ['grades'] as const,
    list: () => [...studentQueryKeys.grades.all, 'list'] as const,
  },

  // Study Stats keys
  stats: {
    all: ['stats'] as const,
    overview: () => [...studentQueryKeys.stats.all, 'overview'] as const,
  },

  // Activities & DRL keys
  activities: {
    all: ['activities'] as const,
    list: (category?: string, registeredOnly?: boolean) =>
      [...studentQueryKeys.activities.all, 'list', { category, registeredOnly }] as const,
    drlSummary: () => [...studentQueryKeys.activities.all, 'drl'] as const,
  },
}

