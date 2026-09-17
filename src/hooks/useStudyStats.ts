import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentApi } from '@/api/studentApi'
import { studentQueryKeys } from './queryKeys'

export const useStudyStats = () => {
  return useQuery({
    queryKey: studentQueryKeys.stats.overview(),
    queryFn: () => studentApi.stats.getOverview(),
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

export const useResetMockData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => studentApi.resetDatabase(),
    onSuccess: () => {
      // Invalidate everything to refresh UI completely
      queryClient.invalidateQueries()
    },
  })
}

export const useApiLatency = () => {
  const [latency, setLatencyState] = useState<number>(() => studentApi.getLatency())

  const setLatency = useCallback((ms: number) => {
    studentApi.setLatency(ms)
    setLatencyState(ms)
  }, [])

  return { latency, setLatency }
}
