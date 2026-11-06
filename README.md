# Hệ Thống Quản Lý Học Tập (CNPM - QLHT)

> Ứng dụng Quản lý Học tập hiện đại theo mô hình đào tạo tín chỉ Đại học Bách Khoa Hà Nội (HUST), xây dựng trên nền tảng **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **shadcn/ui**, **TanStack Query v5 & Table v9**, cùng Backend **Express 5**, **Drizzle ORM** và **PostgreSQL (Supabase)**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

| Phân loại | Công nghệ | Phiên bản | Mô tả |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | [Express](https://expressjs.com/) | `^5.2.1` | Web framework thế hệ mới cho Node.js |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) & [Drizzle ORM](https://orm.drizzle.team/) | `^0.45.4` | ORM type-safe, hiệu năng cao kết nối Supabase / PostgreSQL |
| **API Documentation** | [Swagger UI Express](https://swagger.io/) & OpenAPI 3.0 | `^5.0.1` | Tài liệu API tương tác trực tiếp tại `/api/docs` |
| **Frontend Framework** | [React](https://react.dev/) | `^19.2.0` | Thư viện giao diện người dùng mới nhất |
| **Build Tool** | [Vite](https://vite.dev/) | `^8.3.0` | Bundler siêu tốc độ, hỗ trợ HMR |
| **Ngôn ngữ** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.0` | Type-safety toàn diện cả Frontend & Backend |
| **CSS Framework** | [Tailwind CSS](https://tailwindcss.com/) | `^4.3.0` | `@tailwindcss/vite` thế hệ v4 |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) | `^4.21.0` | Radix UI + Lucide React icons + Geist Font |
| **Server State & Cache** | [TanStack Query](https://tanstack.com/query/latest) | `^5.104.0` | Quản lý fetching, caching, retry và đồng bộ dữ liệu |
| **Data Tables** | [TanStack Table](https://tanstack.com/table/latest) | `^9.2.4` | Bảng dữ liệu headless, sắp xếp, lọc và phân trang |
| **Test Runner** | [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) | `^5.1.0` | Unit & Component Testing siêu tốc độ |
| **Linter** | [Oxlint](https://oxc.rs/) | `^1.81.0` | Linter hiệu năng cao nền tảng Rust |
| **Package Manager** | [pnpm](https://pnpm.io/) | `^11.0.0` | Trình quản lý gói nhanh, tiết kiệm dung lượng đĩa |

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
CNPM - QLHT/
├── frontend/                 # Client React 19 + TypeScript + Vite + Tailwind v4
│   ├── src/
│   │   ├── api/              # API Client (client.ts, studentApi.ts, authApi.ts)
│   │   ├── components/       # shadcn/ui & feature modules
│   │   │   ├── courses/      # Quản lý học phần & modal
│   │   │   ├── grades/       # Bảng điểm chuẩn HUST với @tanstack/react-table
│   │   │   ├── assignments/  # Nhiệm vụ & bài tập deadline
│   │   │   ├── schedule/     # Thời khóa biểu tuần & lịch học
│   │   │   └── shared/       # LoadingState, ErrorState, EmptyState thống nhất
│   │   ├── hooks/            # TanStack Query custom hooks
│   │   ├── lib/              # Adapters (snake_case -> view model) & score.utils.ts
│   │   ├── tests/            # Vitest unit & component test suite (18 tests)
│   │   └── App.tsx           # Dashboard QLHT
│   └── package.json
├── backend/                  # Server Express 5 + TypeScript + Drizzle ORM
│   ├── src/
│   │   ├── controllers/      # Route handlers (Auth, Students, Courses, Grades...)
│   │   ├── db/               # Migrations (DDL 16 bảng), seed, Circuit Breaker
│   │   ├── middlewares/      # auth, logger, notFound, error, validation, rateLimit
│   │   ├── repositories/     # Data Access layer (SQL + in-memory fallback store)
│   │   ├── routes/           # Router modules gắn dưới /api/v1
│   │   ├── services/         # Business logic & công thức tính điểm chuẩn HUST
│   │   ├── utils/            # Response envelope {code, message, data/details} & transaction
│   │   ├── app.ts            # Khởi tạo Express app & gắn Swagger UI
│   │   ├── server.ts         # Server entrypoint
│   │   ├── test-integration.ts # Test suite tích hợp 15 kịch bản
│   │   └── benchmark-nfr.ts    # Đo lường NFR-01 latency percentiles & E2E flow
│   └── package.json
└── docs/                     # Tài liệu thiết kế hệ thống
    ├── API_contract.md       # Hợp đồng API chi tiết các module
    ├── api_doc_openapi.yaml  # Đặc tả OpenAPI 3.0 / Swagger
    └── erd_pseudo_code.dbml  # Thiết kế CSDL quan hệ 16 bảng
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 20.x hoặc mới hơn
- **pnpm**: Phiên bản 9.x hoặc 11.x (Khuyên dùng cho Frontend)
- **npm**: Đi kèm với Node.js

---

### 2. Backend (Express 5 + Drizzle ORM)

#### Cài đặt thư viện:
```bash
cd backend
npm install
```

#### Thiết lập biến môi trường (`backend/.env`):
Tạo file `.env` tại thư mục `backend/` theo mẫu:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cnpm_qlht"
JWT_SECRET=supersecretjwtkey12345_cnpm_qlht
JWT_REFRESH_SECRET=supersecretrefreshjwtkey67890_cnpm_qlht
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
RATE_LIMIT_MAX=300
RATE_LIMIT_WINDOW_MS=900000
```
> **Cơ chế Circuit Breaker**: Khi CSDL từ xa offline, hệ thống tự động ngắt kết nối và phục vụ qua High-Fidelity Fallback Store (đầy đủ tài khoản, sinh viên, học phần, điểm số HUST) trong < 2ms mà không làm gián đoạn trải nghiệm người dùng.

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
- Real-time Metrics (NFR-01): `http://localhost:3000/metrics`
- Swagger UI (Tài liệu API tương tác): `http://localhost:3000/api/docs`

#### Chạy Kiểm Thử Backend (Integration & NFR Benchmark):
```bash
# Chạy toàn bộ test tích hợp và đo lường NFR-01
npm test

# Hoặc chạy từng bộ test độc lập:
npm run test:integration  # 15 kịch bản tích hợp API
npm run test:nfr          # Đo đạc 150 mẫu p50/p90/p95/p99 & luồng E2E
```

#### Build Production Backend:
```bash
npm run build
```

---

### 3. Frontend (React 19 + TanStack Query & Table)

#### Cài đặt thư viện:
```bash
cd frontend
pnpm install
```

#### Thiết lập biến môi trường (`frontend/.env`):
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

#### Khởi chạy môi trường phát triển:
```bash
pnpm dev
```
Truy cập ứng dụng tại: `http://localhost:5173`

#### Chạy Kiểm Thử Frontend (Unit & Component Tests):
```bash
pnpm test
```
Bộ test Vitest kiểm tra 18 kịch bản:
- Công thức tính điểm chuẩn HUST (Guardrail 3, điểm liệt cuối kỳ < 3.0, dải điểm chữ, GPA 4.0).
- Lọc học phần theo từ khóa tìm kiếm, trạng thái, học kỳ.
- Adapters chuyển đổi schema snake_case và integer ID sang view model camelCase.
- Kiểm thử hiển thị và tương tác của LoadingState, ErrorState (kèm nút Thử lại), và EmptyState.

#### Kiểm tra mã nguồn (Linting) & Build:
```bash
# Kiểm tra lint bằng Oxlint
pnpm lint

# Đóng gói sản phẩm cho Production
pnpm build
```

---

## 🏛️ Quy Chuẩn Kiến Trúc & Luồng Dữ Liệu

### 1. Luồng Lựa Chọn Data Source & Xử Lý Lỗi
- **Default Data Source**: Ứng dụng mặc định kết nối tới Backend thực (`http://localhost:3000/api/v1`).
- **Không fallback thành công giả**: Khi gọi API backend thất bại (4xx, 5xx, network error), hệ thống không nuốt lỗi và không tự ý chuyển sang mockDb để giả mạo thành công. Lỗi được truyền trực tiếp tới TanStack Query để kích hoạt `ErrorState` có nút **"Thử lại"** (Retry). Chế độ `Mock` chỉ được kích hoạt khi người dùng chủ động lựa chọn.

### 2. Schema Adapters (Backend Snake_case $\leftrightarrow$ Frontend CamelCase)
Tất cả dữ liệu API trả về từ bảng CSDL quan hệ (`ma_hp`, `ten_hp`, `so_tin_chi`, `ma_lh`, `thu`, `tiet_bd`, `tiet_kt`, `phong_hoc`, `diem_qt`, `diem_ck`, `trongso_qt`, `ma_bt`, `ten_bt`, `mo_ta`, `han_nop`) đều đi qua adapter layer tại `frontend/src/lib/adapters/`:
- Tự động chuẩn hóa integer IDs sang view model string IDs an toàn.
- Chuẩn hóa trạng thái bài tập (`pending`, `in_progress`, `completed`) và độ ưu tiên (`low`, `medium`, `high`).
- Chuẩn hóa lịch học theo thứ trong tuần (`thu: 4` $\rightarrow$ `Wednesday` $\rightarrow$ `Thứ Tư`).
- Tự động tính điểm tổng kết và quy đổi điểm chữ A+, A, B+, B, C+, C, D+, D, F.

### 3. Envelope Response Chuẩn Hóa
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

### 4. Quy Tắc Tính Điểm Chuẩn HUST (Guardrail 3)
- Điểm tổng kết hệ 10: $diem\_tk = diem\_qt \times trongso\_qt + diem\_ck \times (1 - trongso\_qt)$
- Điều kiện qua môn: $diem\_ck \ge 3.0$; nếu $diem\_ck < 3.0$, quy về điểm `F` (0.0).
- Bảng thang điểm chữ và hệ 4:
  - `A+` ($\ge 9.0$) $\rightarrow$ 4.0
  - `A` ($8.5 - 8.9$) $\rightarrow$ 3.7
  - `B+` ($8.0 - 8.4$) $\rightarrow$ 3.5
  - `B` ($7.0 - 7.9$) $\rightarrow$ 3.0
  - `C+` ($6.5 - 6.9$) $\rightarrow$ 2.5
  - `C` ($5.5 - 6.4$) $\rightarrow$ 2.0
  - `D+` ($5.0 - 5.4$) $\rightarrow$ 1.5
  - `D` ($4.0 - 4.9$) $\rightarrow$ 1.0
  - `F` ($< 4.0$) $\rightarrow$ 0.0

---

## 📊 Báo Cáo Đo Lường Chất Lượng & NFR (Phi Chức Năng)

| Tiêu chí NFR | Mục tiêu | Kết quả đo lường thực tế | Đánh giá |
| :--- | :--- | :--- | :--- |
| **NFR-01: Độ trễ API (p95)** | $< 200\text{ ms}$ | **$p95 = 3.08\text{ ms}$** (Trung bình: $1.8\text{ ms}$, $p50 = 1.69\text{ ms}$, $p99 = 5.44\text{ ms}$ trên 150 requests) |  **ĐẠT** (Nhanh hơn ngưỡng yêu cầu $> 60\times$) |
| **NFR-01: Bundle Frontend** | $< 1.5\text{ MB}$ | Bundle gzip: **$209\text{ kB}$** (CSS gzip: $15.2\text{ kB}$), First Contentful Paint $< 0.8\text{ s}$ |  **ĐẠT** |
| **NFR-02: Bảo Mật (Security)** | An toàn danh tính & chống brute-force | JWT Access Token, HttpOnly Cookie cho Refresh Token, Rate Limiter (300 req/15min), CORS Whitelist theo môi trường, 0 lỗ hổng nghiêm trọng ở production |  **ĐẠT** |
| **NFR-04: Khả Dụng & Responsive** | Tương thích đa thiết bị | Breakpoints chuẩn Tailwind v4 (Mobile $375\text{px}$, Tablet $768\text{px}$, Desktop $1024\text{px}$, Wide $1440\text{px}$), Bảng điểm `@tanstack/react-table` hỗ trợ horizontal scroll mượt mà |  **ĐẠT** |
| **NFR-06: Khả Năng Tương Thích** | Đa trình duyệt & Chống sập | Chuẩn ES2023 chạy tốt trên Chrome, Firefox, Safari, Edge. Circuit Breaker tự động chuyển Fallback Store khi DB gián đoạn |  **ĐẠT** |

---

## 📄 Tài Khoản Thử Nghiệm Mẫu

| Tài khoản | Mật khẩu | Quyền hạn | Thông tin sinh viên / giảng viên |
| :--- | :--- | :--- | :--- |
| `sv_20210001` | `123456` | Sinh Viên (`SV`) | Nguyễn Văn An • MSSV: 20210001 • K66 - CNPM 01 |
| `gv_huong` | `123456` | Giảng Viên (`GV`) | TS. Nguyễn Thu Hường • Mã GV: GV082 |
| `admin` | `admin123` | Quản Trị Viên (`AD`) | Quản Trị Viên Hệ Thống • Toàn quyền quản trị |

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng cho môn học **Công Nghệ Phần Mềm (CNPM)**.
Mã nguồn mở phục vụ mục đích học tập và nghiên cứu.
