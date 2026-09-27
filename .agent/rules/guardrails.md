# Project Contract, Goals & Guardrails for CNPM - QLHT

> **Target Audience**: All AI Agents and Developers contributing to this repository.  
> **Repository**: `CNPM - QLHT` (Hệ Thống Quản Lý Học Tập - ĐHBK Hà Nội / HUST model)  
> **Status**: Active & Mandatory  

---

## 🎯 1. Core Mission & High-Level Goals

1. **System Identity**: Xây dựng Hệ thống Quản lý Học tập sinh viên hiện đại, type-safe, module hóa cao dựa trên mô hình đào tạo tín chỉ (phân tách rõ Học phần - `hoc_phan` và Lớp học - `lop_hoc`).
2. **Target Stack**:
   - **Frontend**: React 19, TypeScript (~6.0), Vite, Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui, TanStack Query v5, TanStack Table v9, Oxlint.
   - **Backend**: Node.js 22+, Express 5, TypeScript, Swagger UI (`swagger-ui-express`), YAML OpenAPI 3.0.
   - **Database Model**: DBML / PostgreSQL schema tại `docs/erd_pseudo_code.dbml`.
3. **Core Architectural Pillars**:
   - **Contract-First**: Mọi thay đổi schema hay API phải tuân thủ nghiêm ngặt và cập nhật đồng bộ tại `docs/API_contract.md`, `docs/erd_pseudo_code.dbml` và `docs/api_doc_openapi.yaml`.
   - **Resilience**: Cả hai tầng FE và BE phải build thành công và chạy độc lập hoặc đồng thời mà không bị crash hay phụ thuộc ngầm vào CWD.
   - **RBAC Ready**: Thiết kế hỗ trợ 3 nhóm quyền: Sinh viên (`SV`), Giảng viên (`GV`), và Quản trị viên (`AD`).

---

## 🛡️ 2. Strict Guardrails & Anti-Patterns (TUYỆT ĐỐI TUÂN THỦ)

### 🚫 Guardrail 1: KHÔNG tự ý xóa Mock Layer khi chưa có Real API Client hoàn chỉnh
* **Lý do**: Từng gây ra lỗi gãy toàn bộ frontend build (`TS2307: Cannot find module './mockDb'`).
* **Quy tắc**: Các file `frontend/src/api/mockDb.ts` và `frontend/src/api/mock/mockData.ts` là xương sống cho giao diện phát triển độc lập. Không được phép `git rm`, đổi tên hoặc xóa các hàm mock này trừ khi toàn bộ các hook TanStack Query đã được di chuyển sang gọi HTTP Client thực tế thành công.

### 🚫 Guardrail 2: KHÔNG dùng đường dẫn tương đối phụ thuộc vào `process.cwd()` ở Backend
* **Lý do**: Gây crash ngay lập tức (`ENOENT`) khi backend được khởi chạy từ root hoặc trong Docker container.
* **Quy tắc**: Luôn sử dụng `path.resolve(__dirname, ...)` để định vị tài nguyên nội bộ dự án (như file OpenAPI YAML, templates, uploads). Luôn bọc việc đọc file hệ thống trong `try-catch` và kiểm tra `fs.existsSync()`.

### 🚫 Guardrail 3: KHÔNG tự bịa schema hoặc hardcode công thức điểm trái với ERD
* **Lý do**: ERD quy định điểm quá trình (`diem_qt`), điểm cuối kỳ (`diem_ck`) kết hợp với trọng số quá trình của lớp (`lop_hoc.trongso_qt`).
* **Quy tắc**:
  - Không hardcode 4 đầu điểm tĩnh (10% chuyên cần, 20% thực hành, 20% giữa kỳ, 50% cuối kỳ).
  - Bảng điểm và hàm tính toán phải linh hoạt nhận `trongso_qt` (ví dụ 0.3, 0.4, 0.5) từ `lop_hoc` và tính ra điểm tổng kết hệ 10 và hệ 4 theo chuẩn quy chế đào tạo.

### 🚫 Guardrail 4: KHÔNG để thư viện "ma" (Phantom Dependencies)
* **Quy tắc**: Nếu thư viện được khai báo trong `package.json` và README (đặc biệt là `@tanstack/react-table`), agent **phải** triển khai sử dụng đúng công năng thay vì vẽ bảng HTML thủ công. Nếu không còn sử dụng, phải gỡ bỏ hoàn toàn khỏi `package.json`.

### 🚫 Guardrail 5: Bắt buộc kiểm tra Build & Lint trước khi kết thúc lượt làm việc
Mọi thay đổi mã nguồn phải được kiểm tra qua các lệnh bắt buộc sau:
- **Frontend**:
  ```bash
  cd frontend && pnpm lint && pnpm build
  ```
  *(Phải đạt 0 error, build production thành công).*
- **Backend**:
  ```bash
  cd backend && npm run build
  ```
  *(TypeScript compile ra `dist/` thành công).*

### 🚫 Guardrail 6: Tối ưu hóa TanStack Query & Ngăn chặn Render Cascading
* Không gọi `setState` đồng bộ bên trong `useEffect` khi mở modal (gây cascading render và cảnh báo Oxlint).
* Tất cả ô tìm kiếm gắn với Query Key phải có `useDebounce` (tối thiểu 300ms) để không gây bùng nổ query keys và nghẽn network.
* Các hàm fetch phải nhận và truyền `AbortSignal` (`queryFn: ({ signal }) => ...`) để hỗ trợ hủy request lỗi thời.

---

## 📋 3. Domain Contracts & Single Sources of Truth

| Thành phần | Nguồn chuẩn duy nhất (Single Source of Truth) | Quy ước bắt buộc |
| :--- | :--- | :--- |
| **Cơ sở dữ liệu** | `docs/erd_pseudo_code.dbml` | Phân tách `hoc_phan` và `lop_hoc`. Sinh viên đăng ký lớp qua `dang_ky_lop`. Khóa ngoại tự tham chiếu `malh_lt` phải nullable. |
| **API Contract** | `docs/API_contract.md` | Base URL: `/api/v1`. Danh từ số nhiều (`/courses`, `/classes`, `/schedules`). Hỗ trợ Soft Delete qua `deletedAt`. |
| **Swagger Doc** | `docs/api_doc_openapi.yaml` | Đồng bộ 1:1 với `API_contract.md`. Mọi endpoint mới phải được tài liệu hóa tại đây. |
| **Frontend Types** | `frontend/src/types/index.ts` | Phản ánh chính xác các thực thể CSDL. Nếu cần ViewModels cho UI, dùng tầng Adapter tại `frontend/src/lib/adapters/`. |

---

## 🚀 4. Definition of Done (DoD) cho mỗi Task

Một task được coi là hoàn thành khi và chỉ khi:
1. Mã nguồn tuân thủ toàn bộ 6 Guardrails ở Mục 2.
2. Không làm gãy bất kỳ flow nào đang chạy (Dashboard, Thời khóa biểu, Bảng điểm, Mock latency).
3. Đã chạy thử build và xác nhận không có lỗi biên dịch TypeScript.
4. Tài liệu thiết kế (`docs/`) được cập nhật tương ứng nếu có thay đổi về hợp đồng dữ liệu.

---

## 🗄️ 5. Backend Database & ORM Strategy

* **ORM Framework**: Sử dụng **Drizzle ORM** hoặc **Prisma Client** khi kết nối database thực tế ở Giai đoạn 2.
  * Đảm bảo tính Type-safe toàn diện từ DB Model đến API Controller.
  * Tự động generate migrations tương thích với schema chuẩn tại `docs/erd_pseudo_code.dbml`.
  * Tuyệt đối không viết raw string SQL thiếu kiểm soát kiểu dữ liệu hoặc dễ bị SQL Injection.

---

## 🌿 6. Git & Commit Workflow

* **Commit Style**: Bắt buộc tuân thủ **Conventional Commits**:
  * `feat: <nội dung>`: Thêm tính năng mới hoặc endpoint mới.
  * `fix: <nội dung>`: Vá lỗi logic, lỗi type hoặc lỗi build.
  * `docs: <nội dung>`: Cập nhật tài liệu thiết kế (`ERD`, `API_contract`, `Swagger`).
  * `refactor: <nội dung>`: Tái cấu trúc mã nguồn không làm thay đổi hành vi.
* **Branch Strategy**:
  * Tạo các nhánh tính năng (`feat/<tên-task>`, `fix/<tên-lỗi>`) để kiểm thử độc lập.
  * Chỉ merge vào nhánh `main` sau khi tất cả các kiểm tra lint và build đều passed.
