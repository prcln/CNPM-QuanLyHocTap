# Hệ Thống Quản Lý Học Tập (CNPM - QLHT)

> Ứng dụng Quản lý Học tập hiện đại theo mô hình tín chỉ Đại học Bách Khoa Hà Nội (HUST), xây dựng trên nền tảng **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **shadcn/ui**, **TanStack Query & Table**, cùng Backend **Express 5**, **Drizzle ORM** và **PostgreSQL (Supabase)**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

| Phân loại | Công nghệ | Phiên bản | Mô tả |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | [Express](https://expressjs.com/) | `^5.2.1` | Web framework thế hệ mới cho Node.js |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) & [Drizzle ORM](https://orm.drizzle.team/) | `^0.45.4` | ORM type-safe, hiệu năng cao kết nối Supabase |
| **API Documentation** | [Swagger UI Express](https://swagger.io/) & OpenAPI 3.0 | `^5.0.1` | Tài liệu API tương tác trực tiếp tại `/api/docs` |
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
├── frontend/                 # Client React 19 + TypeScript + Vite + Tailwind v4
│   ├── src/
│   │   ├── api/              # API services (studentApi, courseApi, mockDb...)
│   │   ├── components/       # shadcn/ui components & modules
│   │   ├── hooks/            # TanStack Query custom hooks
│   │   ├── lib/              # Adapters, score calculation, utils
│   │   └── App.tsx           # Dashboard QLHT
│   └── package.json
├── backend/                  # Server Express 5 + TypeScript + Drizzle ORM
│   ├── src/
│   │   ├── controllers/      # Route handlers (Auth, Students, Courses, Grades...)
│   │   ├── db/               # Migrations (DDL 16 bảng), seed, Drizzle schemas
│   │   ├── middlewares/      # auth, logger, notFound, error, validation
│   │   ├── repositories/     # Data Access layer (SQL + in-memory fallback store)
│   │   ├── routes/           # Router modules gắn dưới /api/v1
│   │   ├── services/         # Business logic & công thức tính điểm chuẩn HUST
│   │   ├── utils/            # Response envelope {code, message, data/details} & transaction
│   │   ├── app.ts            # Khởi tạo Express app & gắn Swagger UI
│   │   ├── server.ts         # Server entrypoint
│   │   └── test-integration.ts # Test suite tích hợp 15 kịch bản
│   └── package.json
└── docs/                     # Tài liệu thiết kế hệ thống
    ├── API_contract.md       # Hợp đồng API chi tiết các module
    ├── api_doc_openapi.yaml  # Đặc tả OpenAPI 3.0 / Swagger
    └── erd_pseudo_code.dbml  # Thiết kế CSDL quan hệ 16 bảng
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 20.x hoặc mới hơn
- **pnpm**: Phiên bản 9.x hoặc 11.x (Khuyên dùng cho Frontend)
- **npm**: Đi kèm với Node.js

---

### 2. Backend (Express 5 + Drizzle ORM)

#### Cài đặt thư viện & Thiết lập môi trường:
```bash
cd backend
npm install
```

Tạo hoặc kiểm tra file `.env` tại thư mục `backend/`:
```env
PORT=3000
DATABASE_URL="postgres://postgres.xxx:pass@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
JWT_SECRET=supersecretjwtkey12345_cnpm_qlht
```
*(Hệ thống đã tích hợp sẵn cơ chế High-Fidelity Fallback Store tự động: nếu CSDL từ xa offline, server vẫn khởi chạy và trả dữ liệu mẫu chuẩn HUST trơn tru).*

#### Chạy Migration & Seed CSDL:
```bash
# Chạy migration DDL 16 bảng theo chuẩn ERD
npm run db:migrate

# Chạy seed dữ liệu mẫu HUST (tài khoản, sinh viên, học phần, lớp học, điểm...)
npm run db:seed
```

#### Khởi chạy Backend Server:
```bash
npm run dev
```
- API Base URL: `http://localhost:3000/api/v1`
- Healthcheck: `http://localhost:3000/health` hoặc `http://localhost:3000/api/v1/health`
- Swagger UI (Tài liệu API tương tác): `http://localhost:3000/api/docs`

#### Chạy Test Tích Hợp (Integration Tests):
```bash
npm run test:integration
```
Bộ test kiểm tra toàn bộ 15 kịch bản từ Authentication, Request Validation, GPA, Điểm chữ HUST theo `trongso_qt`, Đăng ký/hủy lớp đa bảng, cho tới Not Found Handler.

#### Build Production:
```bash
npm run build
```

---

### 3. Frontend (React 19 + TanStack Query)

#### Cài đặt thư viện:
```bash
cd frontend
pnpm install
```

#### Chạy môi trường phát triển:
```bash
pnpm dev
```
Mở trình duyệt tại: `http://localhost:5173`

#### Kiểm tra mã nguồn (Linting):
```bash
pnpm lint
```

#### Đóng gói Production (Build):
```bash
pnpm build
```

---

## 🏛️ Quy Chuẩn Kiến Trúc & API

### 1. Envelope Response Chuẩn Hóa
Tất cả endpoint trả về cấu trúc thống nhất:
- **Thành công (Success Response)**:
  ```json
  {
    "code": 200,
    "message": "Thành công",
    "data": { ... },
    "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
  }
  ```
- **Lỗi & Validation (Error Response)**:
  ```json
  {
    "code": 400,
    "message": "Dữ liệu không hợp lệ",
    "details": [
      { "field": "username", "message": "username là bắt buộc" }
    ]
  }
  ```

### 2. Quy Tắc Tính Điểm Chuẩn HUST
- Điểm tổng kết hệ 10: $diem\_tk = diem\_qt \times trongso\_qt + diem\_ck \times (1 - trongso\_qt)$
- Điều kiện qua môn: $diem\_ck \ge 3.0$; nếu $diem\_ck < 3.0$, quy về điểm `F`.
- Bảng thang điểm chữ và hệ 4:
  - `A+` (8.5 - 10) $\rightarrow$ 4.0
  - `A` (8.0 - 8.4) $\rightarrow$ 4.0
  - `B+` (7.0 - 7.9) $\rightarrow$ 3.5
  - `B` (6.5 - 6.9) $\rightarrow$ 3.0
  - `C+` (5.5 - 6.4) $\rightarrow$ 2.5
  - `C` (5.0 - 5.4) $\rightarrow$ 2.0
  - `D+` (4.5 - 4.9) $\rightarrow$ 1.5
  - `D` (4.0 - 4.4) $\rightarrow$ 1.0
  - `F` (< 4.0) $\rightarrow$ 0.0

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng cho môn học **Công Nghệ Phần Mềm (CNPM)**.
Mã nguồn mở phục vụ mục đích học tập và nghiên cứu.
