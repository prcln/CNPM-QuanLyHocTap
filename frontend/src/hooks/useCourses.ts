import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/api/studentApi'
import { studentQueryKeys } from './queryKeys'
import type { Course, CourseFilters } from '@/types/student'

export const useCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: studentQueryKeys.courses.list(filters),
    queryFn: () => studentApi.courses.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useCourse = (id: string, enabled = true) => {
  return useQuery({
    queryKey: studentQueryKeys.courses.detail(id),
    queryFn: () => studentApi.courses.getById(id),
    enabled: Boolean(id) && enabled,
  })
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) =>
      studentApi.courses.create(data),
    onSuccess: () => {
      // Invalidate courses list, stats, and grades so UI re-syncs
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.courses.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.grades.all })
    },
  })
}

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<Course, 'id' | 'createdAt'>>
    }) => studentApi.courses.update(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.courses.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.courses.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentApi.courses.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.courses.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.grades.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}
