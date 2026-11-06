import React from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface LoadingStateProps {
  message?: string
  type?: 'skeleton' | 'spinner' | 'table'
  count?: number
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Đang tải dữ liệu...',
  type = 'skeleton',
  count = 3,
  className = '',
}) => {
  if (type === 'spinner') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center p-12 space-y-3 text-muted-foreground ${className}`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">{message}</p>
        <span className="sr-only">{message}</span>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div role="status" aria-live="polite" className={`p-8 text-center space-y-3 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="animate-pulse border-border/60">
          <CardHeader className="space-y-2 pb-2">
            <div className="h-5 w-24 bg-muted rounded"></div>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
      <span className="sr-only">{message}</span>
    </div>
  )
}

