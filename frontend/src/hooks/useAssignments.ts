import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/api/studentApi'
import { studentQueryKeys } from './queryKeys'
import type { Assignment, AssignmentFilters } from '@/types/student'

export const useAssignments = (filters?: AssignmentFilters) => {
  return useQuery({
    queryKey: studentQueryKeys.assignments.list(filters),
    queryFn: () => studentApi.assignments.getAll(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export const useCreateAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Assignment, 'id' | 'createdAt'>) =>
      studentApi.assignments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Omit<Assignment, 'id' | 'createdAt'>>
    }) => studentApi.assignments.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}

export const useToggleAssignmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentApi.assignments.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentApi.assignments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}
