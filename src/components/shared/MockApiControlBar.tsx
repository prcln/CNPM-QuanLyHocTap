import { Database, RotateCcw, Zap, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useResetMockData, useApiLatency } from '@/hooks/useStudyStats'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

export function MockApiControlBar() {
  const { latency, setLatency } = useApiLatency()
  const resetMutation = useResetMockData()
  const isFetchingCount = useIsFetching()
  const isMutatingCount = useIsMutating()

  const latencyOptions = [
    { label: '0ms (Tức thì)', value: 0 },
    { label: '300ms (Nhanh)', value: 300 },
    { label: '600ms (Bình thường)', value: 600 },
    { label: '1200ms (Mạng chậm)', value: 1200 },
  ]

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu (môn học, bài tập, điểm số) về mặc định ban đầu?')) {
      resetMutation.mutate()
    }
  }

  return (
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
              </Badge>
            )}
          </div>
        </div>

        {/* Latency switcher & reset */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Độ trễ giả lập:</span>
            <div className="flex items-center rounded-lg border bg-background p-0.5">
              {latencyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLatency(opt.value)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
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
            className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <RotateCcw className={`h-3 w-3 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
            {resetMutation.isPending ? 'Đang khôi phục...' : 'Khôi phục dữ liệu gốc'}
          </Button>
        </div>
      </div>
    </div>
  )
}
