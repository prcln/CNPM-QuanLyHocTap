<<<<<<< HEAD
import { Database, RotateCcw, Zap, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useResetMockData, useApiLatency } from '@/hooks/useStudyStats'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
=======
import { useState, useEffect } from 'react'
import { Database, RotateCcw, Zap, RefreshCw, Server, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useResetMockData, useApiLatency } from '@/hooks/useStudyStats'
import { useIsFetching, useIsMutating, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { DataSourceMode } from '@/api/client'
>>>>>>> develop

export function MockApiControlBar() {
  const { latency, setLatency } = useApiLatency()
  const resetMutation = useResetMockData()
  const isFetchingCount = useIsFetching()
  const isMutatingCount = useIsMutating()
<<<<<<< HEAD

  const latencyOptions = [
    { label: '0ms (Tức thì)', value: 0 },
    { label: '300ms (Nhanh)', value: 300 },
    { label: '600ms (Bình thường)', value: 600 },
    { label: '1200ms (Mạng chậm)', value: 1200 },
  ]

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu (môn học, bài tập, điểm số) về mặc định ban đầu?')) {
=======
  const queryClient = useQueryClient()

  const [mode, setMode] = useState<DataSourceMode>(() => apiClient.getMode())
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false)

  const latencyOptions = [
    { label: '0ms', value: 0 },
    { label: '300ms', value: 300 },
    { label: '600ms', value: 600 },
  ]

  const checkHealth = async () => {
    const isOk = await apiClient.checkBackendHealth()
    setBackendHealthy(isOk)
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleMode = (newMode: DataSourceMode) => {
    apiClient.setMode(newMode)
    setMode(newMode)
    queryClient.invalidateQueries()
  }

  const handleReset = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu (môn học, bài tập, điểm số) về mặc định ban đầu?'
      )
    ) {
>>>>>>> develop
      resetMutation.mutate()
    }
  }

  return (
<<<<<<< HEAD
    <div className="rounded-xl border bg-card/60 backdrop-blur px-4 py-3 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Status indicator */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="flex items-center gap-1.5 text-foreground">
              <Database className="h-3.5 w-3.5 text-primary" />
              Mock API: <span className="text-muted-foreground">LocalStorage Persistence</span>
            </span>
          </div>

          <div className="h-3.5 w-px bg-border hidden sm:block"></div>

          {/* Sync indicator */}
          <div className="flex items-center gap-1.5">
            {isFetchingCount > 0 || isMutatingCount > 0 ? (
              <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 font-normal animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                Đang nạp cache ({isFetchingCount + isMutatingCount})
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-xs py-0.5 px-2 font-normal text-muted-foreground">
                <Zap className="h-3 w-3 text-amber-500" /> Cache TanStack đồng bộ
=======
    <div className="rounded-2xl border border-border/80 bg-card/75 backdrop-blur-md px-4 py-3 shadow-xs transition-colors">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Source switcher & Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Dual mode selector */}
          <div className="flex items-center rounded-xl border bg-background/80 p-0.5">
            <button
              type="button"
              onClick={() => handleToggleMode('mock')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                mode === 'mock'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Mock LocalStorage</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode('backend')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                mode === 'backend'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Server className="h-3.5 w-3.5" />
              <span>Backend Express (:3000)</span>
            </button>
          </div>

          {/* Backend Status indicator */}
          <div
            onClick={checkHealth}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            title="Nhấn để kiểm tra kết nối Backend"
          >
            {backendHealthy ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[11px] gap-1 font-medium">
                <Wifi className="h-3 w-3" />
                Backend Online
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] gap-1 text-amber-600 dark:text-amber-400 border-amber-300 font-medium">
                <WifiOff className="h-3 w-3" />
                Backend Offline (Fallback tự động)
              </Badge>
            )}
          </div>

          <div className="h-3.5 w-px bg-border hidden sm:block" />

          {/* TanStack Sync state */}
          <div className="flex items-center gap-1.5">
            {isFetchingCount > 0 || isMutatingCount > 0 ? (
              <Badge variant="secondary" className="gap-1 text-[11px] py-0.5 px-2 font-normal animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                Đang đồng bộ ({isFetchingCount + isMutatingCount})
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-[11px] py-0.5 px-2 font-normal text-muted-foreground">
                <Zap className="h-3 w-3 text-amber-500" /> Cache TanStack sẵn sàng
>>>>>>> develop
              </Badge>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Latency switcher & reset */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Độ trễ giả lập:</span>
            <div className="flex items-center rounded-lg border bg-background p-0.5">
=======
        {/* Right: Latency & Reset database */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Độ trễ:</span>
            <div className="flex items-center rounded-lg border bg-background/80 p-0.5">
>>>>>>> develop
              {latencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLatency(opt.value)}
<<<<<<< HEAD
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
=======
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
>>>>>>> develop
                    latency === opt.value
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={resetMutation.isPending}
<<<<<<< HEAD
            className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <RotateCcw className={`h-3 w-3 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
            {resetMutation.isPending ? 'Đang khôi phục...' : 'Khôi phục dữ liệu gốc'}
=======
            className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 rounded-lg"
          >
            <RotateCcw className={`h-3 w-3 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
            {resetMutation.isPending ? 'Đang reset...' : 'Khôi phục dữ liệu gốc'}
>>>>>>> develop
          </Button>
        </div>
      </div>
    </div>
  )
}
