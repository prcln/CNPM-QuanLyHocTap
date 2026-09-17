import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/api/studentApi'
import { studentQueryKeys } from './queryKeys'

export const useGrades = () => {
  return useQuery({
    queryKey: studentQueryKeys.grades.list(),
    queryFn: () => studentApi.grades.getAll(),
    staleTime: 1000 * 60 * 2,
  })
}

export const useUpdateGradeRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      scores,
    }: {
      id: string
      scores: {
        attendanceScore: number
        midtermScore: number
        practicalScore: number
        finalExamScore: number
      }
    }) => studentApi.grades.update(id, scores),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.grades.all })
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.stats.all })
    },
  })
}
