import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import {
  LoadingState,
  ErrorState,
  EmptyState,
  ConfirmModal,
  ToastProvider,
  useToast,
  ConfirmProvider,
  useConfirm,
} from '../components/shared'

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

  it('ConfirmModal hiển thị nội dung và kích hoạt callback onConfirm/onClose', () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()

    const { rerender } = render(
      <ConfirmModal
        isOpen={false}
        title="Xóa Học Phần"
        description="Bạn có chắc muốn xóa học phần này?"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    )
    expect(screen.queryByText('Xóa Học Phần')).toBeNull()

    rerender(
      <ConfirmModal
        isOpen={true}
        title="Xóa Học Phần"
        description="Bạn có chắc muốn xóa học phần này?"
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    )

    expect(screen.getByText('Xóa Học Phần')).toBeDefined()
    expect(screen.getByText('Bạn có chắc muốn xóa học phần này?')).toBeDefined()

    const confirmBtn = screen.getByRole('button', { name: /xác nhận xóa/i })
    fireEvent.click(confirmBtn)
    expect(handleConfirm).toHaveBeenCalledTimes(1)

    const cancelBtn = screen.getByRole('button', { name: /hủy bỏ/i })
    fireEvent.click(cancelBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('ToastProvider và useToast hiển thị thông báo toast thành công', () => {
    function TestToastConsumer() {
      const { toast } = useToast()
      return (
        <div>
          <button onClick={() => toast.success('Lưu dữ liệu thành công', { title: 'Thành công' })}>
            Show Toast
          </button>
        </div>
      )
    }

    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    )

    const triggerBtn = screen.getByText('Show Toast')
    act(() => {
      fireEvent.click(triggerBtn)
    })

    expect(screen.getByText('Thành công')).toBeDefined()
    expect(screen.getByText('Lưu dữ liệu thành công')).toBeDefined()
  })

  it('ConfirmProvider và useConfirm hoạt động qua Promise', async () => {
    let result = false
    function TestConfirmConsumer() {
      const confirm = useConfirm()
      return (
        <button
          onClick={async () => {
            const ok = await confirm({
              title: 'Xác nhận duyệt',
              description: 'Tiến hành duyệt?',
              confirmText: 'Đồng ý',
            })
            result = ok
          }}
        >
          Mở Confirm
        </button>
      )
    }

    render(
      <ConfirmProvider>
        <TestConfirmConsumer />
      </ConfirmProvider>
    )

    fireEvent.click(screen.getByText('Mở Confirm'))
    expect(screen.getByText('Xác nhận duyệt')).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: /đồng ý/i }))
    await waitFor(() => {
      expect(result).toBe(true)
    })
  })
})
