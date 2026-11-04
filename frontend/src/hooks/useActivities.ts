import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/api/studentApi'
import { studentQueryKeys } from './queryKeys'
import type { ActivityCategory } from '@/types/student'

export const useActivities = (category?: ActivityCategory | 'all', registeredOnly?: boolean) => {
  return useQuery({
    queryKey: studentQueryKeys.activities.list(category, registeredOnly),
    queryFn: () => studentApi.activities.getAll(category, registeredOnly),
    staleTime: 1000 * 60 * 2,
  })
}

export const useDrlSummary = () => {
  return useQuery({
    queryKey: studentQueryKeys.activities.drlSummary(),
    queryFn: () => studentApi.activities.getDrlSummary(),
    staleTime: 1000 * 60 * 2,
  })
}

export const useToggleActivityRegistration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => studentApi.activities.toggleRegister(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.activities.all })
    },
  })
}
