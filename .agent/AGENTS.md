# Workspace Directives for Antigravity AI Agents

> **Context**: Dự án **CNPM - QLHT** (Hệ Thống Quản Lý Học Tập - Tech Stack: React 19 + TypeScript + Express 5 + TanStack Query v5 & Table v9).  
> **Mandatory Rule File**: [guardrails.md](file:///d:/Coding2026/CNPM%20-%20QLHT/.agent/rules/guardrails.md)

---

## ⚠️ Mandatory Agent Directives (Bắt Buộc)

Mọi agent khi làm việc trong workspace này PHẢI đọc và tuân thủ các quy tắc sau:

1. **Tuân thủ 6 Rào chắn cốt lõi**: Xem chi tiết tại [.agent/rules/guardrails.md](file:///d:/Coding2026/CNPM%20-%20QLHT/.agent/rules/guardrails.md):
   - **G1**: Không xóa hoặc phá vỡ Mock Layer (`frontend/src/api/mockDb.ts`, `mockData.ts`).
   - **G2**: Không dùng đường dẫn phụ thuộc `process.cwd()` trong backend. Luôn dùng `path.resolve(__dirname, ...)`.
   - **G3**: Không tự ý sửa schema hoặc bịa công thức điểm trái với `docs/erd_pseudo_code.dbml` (quá trình theo `trongso_qt` và cuối kỳ).
   - **G4**: Không để phantom dependencies (nếu có `@tanstack/react-table` thì phải dùng thay vì viết `<table>` HTML chay).
   - **G5**: Luôn chạy kiểm tra `pnpm lint`, `pnpm build` (FE) và `npm run build` (BE) trước khi kết thúc task.
   - **G6**: Tối ưu TanStack Query (debounce search, truyền `AbortSignal`, không `setState` trong `useEffect`).

2. **Kế hoạch triển khai đã phê duyệt**:
   - Tham khảo và bám sát lộ trình 3 giai đoạn tại [.agent/plans/implementation_plan_backend](file:///d:/Coding2026/CNPM%20-%20QLHT/.agent/plans/implementation_plan_backend).

3. **Cập nhật tài liệu đồng bộ**:
   - Nếu sửa đổi CSDL hoặc API, bắt buộc cập nhật đồng bộ cả 3 file:
     - [docs/erd_pseudo_code.dbml](file:///d:/Coding2026/CNPM%20-%20QLHT/docs/erd_pseudo_code.dbml)
     - [docs/API_contract.md](file:///d:/Coding2026/CNPM%20-%20QLHT/docs/API_contract.md)
     - [docs/api_doc_openapi.yaml](file:///d:/Coding2026/CNPM%20-%20QLHT/docs/api_doc_openapi.yaml)
