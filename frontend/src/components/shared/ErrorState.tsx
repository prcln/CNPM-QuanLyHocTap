import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã xảy ra lỗi khi tải dữ liệu',
  message = 'Không thể kết nối hoặc nhận phản hồi hợp lệ từ máy chủ. Vui lòng thử lại.',
  onRetry,
  isRetrying = false,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3 ${className}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-base text-foreground">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="gap-2 border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>Thử lại</span>
          </Button>
        </div>
      )}
    </div>
  )
}

