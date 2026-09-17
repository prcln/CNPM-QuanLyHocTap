# Hệ Thống Quản Lý Học Tập (CNPM - QLHT)

> Ứng dụng web Quản lý Học tập hiện đại xây dựng trên nền tảng **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **shadcn/ui** và **TanStack Query & Table**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

| Phân loại | Công nghệ | Phiên bản | Mô tả |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | [React](https://react.dev/) | `^19.2.0` | Thư viện giao diện người dùng mới nhất |
| **Build Tool** | [Vite](https://vite.dev/) | `^8.3.0` | Bundler siêu tốc độ, hỗ trợ HMR |
| **Ngôn ngữ** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.0` | Type-safety toàn diện |
| **CSS Framework** | [Tailwind CSS](https://tailwindcss.com/) | `^4.3.0` | `@tailwindcss/vite` thế hệ v4 |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) | `^4.21.0` | Radix UI + Lucide React icons + Geist Font |
| **Server State & Cache** | [TanStack Query](https://tanstack.com/query/latest) | `^5.102.0` | Quản lý fetching, caching và đồng bộ dữ liệu |
| **Data Tables** | [TanStack Table](https://tanstack.com/table/latest) | `^9.2.0` | Bảng dữ liệu headless, sắp xếp, lọc và phân trang |
| **Linter** | [Oxlint](https://oxc.rs/) | `^1.81.0` | Linter hiệu năng cao nền tảng Rust |
| **Package Manager** | [pnpm](https://pnpm.io/) | `^11.0.0` | Trình quản lý gói nhanh, tiết kiệm dung lượng đĩa |

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
CNPM - QLHT/
|-- frontend
  ├── public/                 # Tài nguyên tĩnh
  ├── src/
  │   ├── assets/             # Hình ảnh, icons tĩnh
  │   ├── components/
  │   │   └── ui/             # Các UI components từ shadcn/ui
  │   │       ├── badge.tsx
  │   │       ├── button.tsx
  │   │       ├── card.tsx
  │   │       └── input.tsx
  │   ├── lib/
  │   │   └── utils.ts        # Hàm tiện ích cn (clsx + tailwind-merge)
  │   ├── App.tsx             # Giao diện chính (Dashboard QLHT)
  │   ├── index.css           # Cấu hình Tailwind v4 & Biến màu shadcn
  │   └── main.tsx            # Entry point tích hợp QueryClientProvider & Devtools
  ├── components.json         # Cấu hình shadcn/ui CLI
  ├── package.json            # Danh sách dependencies và npm scripts
  ├── tsconfig.json           # Cấu hình TypeScript gốc
  ├── tsconfig.app.json       # Cấu hình TypeScript ứng dụng & alias @/*
  └── vite.config.ts          # Cấu hình Vite (@tailwindcss/vite & path alias)
|-- backend
|-- docs
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 20.x hoặc mới hơn
- **pnpm**: Phiên bản 9.x hoặc 11.x (Khuyên dùng)

### 2. Cài đặt thư viện
Nếu bạn vừa clone repository về máy:
```bash
cd frontend
pnpm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
pnpm dev
```
Mở trình duyệt tại: `http://localhost:5173`

### 4. Kiểm tra mã nguồn (Linting)
```bash
pnpm lint
```

### 5. Đóng gói cho môi trường Production (Build)
```bash
pnpm build
```

### 6. Xem thử bản build (Preview)
```bash
pnpm preview
```

---

## 🧩 Hướng Dẫn Mở Rộng

### Thêm Component từ shadcn/ui
Dự án đã được cấu hình hoàn chỉnh với `components.json`. Bạn có thể bổ sung thêm các thành phần giao diện chỉ với 1 dòng lệnh:

```bash
# Thêm Dialog modal
pnpm dlx shadcn@latest add dialog -y

# Thêm Dropdown Menu
pnpm dlx shadcn@latest add dropdown-menu -y

# Thêm Table component
pnpm dlx shadcn@latest add table -y

# Thêm Form & Tabs
pnpm dlx shadcn@latest add form tabs -y
```

### Sử dụng TanStack Query (React Query)
Provider đã được thiết lập sẵn tại [src/main.tsx](file:///d:/Coding2026/CNPM%20-%20QLHT/src/main.tsx). Để gọi API và quản lý cache:

```tsx
import { useQuery } from '@tanstack/react-query'

function CourseList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses')
      return res.json()
    },
  })

  if (isLoading) return <div>Đang tải dữ liệu...</div>
  if (error) return <div>Lỗi: {error.message}</div>

  return (
    <ul>
      {data?.map((course) => (
        <li key={course.id}>{course.name}</li>
      ))}
    </ul>
  )
}
```

*Lưu ý: Bộ công cụ **React Query Devtools** đã được tích hợp sẵn ở góc màn hình khi chạy chế độ dev.*

### Sử dụng Path Alias `@/*`
Bạn có thể import các file từ thư mục `src` bằng cú pháp ngắn gọn `@/...`:
```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng cho môn học **Công Nghệ Phần Mềm (CNPM)**.
Mã nguồn mở phục vụ mục đích học tập và nghiên cứu.
