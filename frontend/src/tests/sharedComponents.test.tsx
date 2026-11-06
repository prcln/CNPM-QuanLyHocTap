import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoadingState, ErrorState, EmptyState } from '../components/shared'

describe('Shared UI Components Suite (Empty / Loading / Error States)', () => {
  it('LoadingState hiển thị đúng thông điệp và role=status cho accessibility', () => {
    render(<LoadingState message="Đang tải dữ liệu học tập..." type="spinner" />)
    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.getAllByText('Đang tải dữ liệu học tập...').length).toBeGreaterThan(0)
  })

  it('ErrorState hiển thị thông báo lỗi và kích hoạt callback khi bấm nút "Thử lại"', () => {
    const handleRetry = vi.fn()
    render(
      <ErrorState
        title="Lỗi kết nối máy chủ"
        message="Không thể kết nối đến http://localhost:3000/api/v1"
        onRetry={handleRetry}
      />
    )

    expect(screen.getByRole('alert')).toBeDefined()
    expect(screen.getByText('Lỗi kết nối máy chủ')).toBeDefined()
    expect(screen.getByText('Không thể kết nối đến http://localhost:3000/api/v1')).toBeDefined()

    const retryButton = screen.getByRole('button', { name: /thử lại/i })
    fireEvent.click(retryButton)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('EmptyState hiển thị tiêu đề, mô tả và nút hành động', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState
        title="Không tìm thấy môn học nào"
        description="Hãy thêm môn học mới để bắt đầu quản lý học tập."
        actionLabel="Thêm Môn Học"
        onAction={handleAction}
      />
    )

    expect(screen.getByText('Không tìm thấy môn học nào')).toBeDefined()
    expect(screen.getByText('Hãy thêm môn học mới để bắt đầu quản lý học tập.')).toBeDefined()

    const actionBtn = screen.getByRole('button', { name: /thêm môn học/i })
    fireEvent.click(actionBtn)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })
})
