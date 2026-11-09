## Quy uoc

| Thành phần     | Quy ước                                           |
| -------------- | ------------------------------------------------- |
| Base URL       | `/api/v1`                                         |
| Content-Type   | `application/json`                                |
| Authentication | `Authorization: Bearer <token>`                   |
| Role           | `SV` (Sinh viên), `GV` (Giảng viên), `AD` (Admin) |
| ID             | integer                                           |
| Timestamp      | ISO 8601                                          |
| Delete         | Soft delete (update `deleted_at`, `deleted_by`)   |
| Error          | HTTP status + `{code, message, details}`          |


### Kiến trúc Xác thực & Phân quyền (Authentication & Authorization)

Hệ thống đã triển khai đầy đủ cơ chế **JWT Dual-Token** (Access Token + Refresh Token Cookie) kết hợp RBAC và Scoping:

1. **Cơ chế xác thực (JWT vs Session):**
   - Lựa chọn **JWT** dạng kép để duy trì trạng thái phi tập trung (stateless API), tối ưu cho Single Page Application (React) và REST backend.
   - **Access Token:** Vòng đời ngắn (**15 phút**), truyền qua Header `Authorization: Bearer <access_token>`. Chứa payload tối thiểu `{ matk, username, role }`.
   - **Refresh Token:** Vòng đời dài (**7 ngày**), được băm SHA-256 lưu trong bảng `refresh_tokens`, gửi qua cookie bảo mật `refreshToken` (`httpOnly: true`, `sameSite: "lax"`, `secure: isProduction`).

2. **Vòng đời Token, Xoay vòng (Rotation) & Thu hồi (Revocation):**
   - **Đăng nhập (`/auth/login`):** Băm kiểm tra mật khẩu qua bcrypt (10 rounds), sinh cặp token mới và thiết lập HttpOnly cookie.
   - **Xoay vòng Token (`/auth/refresh` - Refresh Token Rotation):** Mỗi lần làm mới token, refresh token cũ bị đánh dấu đã dùng/thu hồi và một cặp token mới được cấp phát. Nếu phát hiện token cũ được gửi lại, hệ thống cảnh báo đánh cắp token và trả về `403 Forbidden`.
   - **Đăng xuất (`/auth/logout`):** Đánh dấu thu hồi token trong DB (`revoked_at = NOW()`) và hủy cookie trên trình duyệt (`res.clearCookie`).

3. **Bảo mật Mật khẩu (Password Security):**
   - Mật khẩu lưu trữ luôn được băm bằng `bcrypt` (10 salt rounds).
   - Tuyệt đối **không trả password** (kể cả dạng hash) trong bất kỳ phản hồi API nào (`/auth/*`, `/accounts/*`, `/students/*`).
   - Logger hệ thống không log mật khẩu thô hoặc thông tin nhạy cảm.

4. **Biến môi trường (Environment Configuration):**
   - `JWT_ACCESS_SECRET`: Secret key ký và giải mã Access Token.
   - `JWT_REFRESH_SECRET`: Secret key ký và giải mã Refresh Token.
   - `JWT_ACCESS_EXPIRES_IN`: Thời hạn sống của Access Token (mặc định `15m`).
   - `JWT_REFRESH_EXPIRES_IN`: Thời hạn sống của Refresh Token (mặc định `7d`).
   - `JWT_REFRESH_COOKIE_NAME`: Tên cookie lưu refresh token (mặc định `refreshToken`).

5. **Role Guard & Giới hạn dữ liệu theo người dùng (Data Scoping):**
   - Role Guard: `SV`, `GV`, `AD`.
   - Middleware `authenticateToken` kiểm tra tính hợp lệ và hạn dùng của JWT (thiếu/hết hạn trả `401`).
   - Middleware `requireRole(...)` chặn các role không hợp lệ (trả `403`).
   - Tất cả các endpoint cá nhân (`/students/me/*`, `/lecturers/me/*`, `/accounts/me`) bắt buộc định danh dựa trên `req.user.matk` lấy từ token đã xác thực; **không tin tưởng** và không cho phép can thiệp `masv`/`matk` gửi từ client.

Note 2: Có thể xem format request / response trong Swagger rồi định nghĩa type tương ứng cho request / response trong frontend

Note 3: Method `DELETE` hiện tại là Soft Delete, tức là thay vì xóa cứng (thực tế khi phát triển phần mềm, không ai xóa cứng dữ liệu cả), thì ae xóa mềm bằng cách update 2 trường `deleted_at` (timestamp - xóa lúc nào) và `deleted_by` (giá trị là ID của người xóa, trong database tôi đang định nghĩa là trường `matk` của bảng `tai_khoan`, tức là xóa bởi ai). Khi trả kết quả query về cho frontend thì sẽ chỉ lấy các record mà 2 trường deleted kia là `null`.

Note 4: Ae để ý phần phân quyền, trong bảng `tai_khoan` có field là `role`, với 3 giá trị tôi đã viết ở bảng trên. Trong các API bên dưới tôi cũng sẽ liệt kê các Role được quyền gọi API tương ứng.

Note 5: 2000 dòng của cái file định nghĩa API cho Swagger (file `docs/api_doc_openapi.yaml`) là do AI gen (đương nhiên tôi viết hết thế quái nào được 2k dòng), nên nếu có sai sót hay lấn cấn thì báo lại cho tôi (Huy)


## Swagger UI (OpenAPI)
+ URL: `{backend_url}/api/docs`



## APIs

Mỗi module tương ứng với từng Table trong [ERD](./ERD.png)

### 1. Module tài khoản

| Method | Endpoint           | Role     | Description                                               |
| ------ | ------------------ | -------- | --------------------------------------------------------- |
| POST   | `/auth/register`   | Public   | Đăng ký tài khoản mới (SV)                                |
| POST   | `/auth/login`      | Public   | Đăng nhập (nhận access token & refresh token cookie)      |
| POST   | `/auth/refresh`    | Public   | Làm mới Access Token (xoay vòng Refresh Token qua Cookie) |
| POST   | `/auth/logout`     | SV/GV/AD | Đăng xuất (thu hồi refresh token và xóa cookie)           |
| GET    | `/auth/me`         | SV/GV/AD | Lấy tài khoản hiện tại                                    |
| GET    | `/accounts/me`     | SV/GV/AD | Lấy tài khoản hiện tại                                    |
| GET    | `/accounts`        | AD       | Danh sách tài khoản                                       |
| GET    | `/accounts/{matk}` | AD       | Chi tiết tài khoản                                        |
| POST   | `/accounts`        | AD       | Tạo tài khoản                                             |
| PUT    | `/accounts/{matk}` | AD       | Cập nhật tài khoản                                        |
| DELETE | `/accounts/{matk}` | AD       | Soft delete tài khoản                                     |


### 2. Module sinh viên

| Method | Endpoint                     | Role  | Description                      |
| ------ | ---------------------------- | ----- | -------------------------------- |
| GET    | `/students/me`               | SV    | Thông tin sinh viên hiện tại     |
| PUT    | `/students/me`               | SV    | Cập nhật thông tin được phép sửa |
| GET    | `/students/me/grades`        | SV    | Xem toàn bộ điểm                 |
| GET    | `/students/me/grades/{malh}` | SV    | Xem điểm một lớp                 |
| PUT    | `/students/me/grades/{malh}` | SV    | Cập nhật điểm một lớp (tự tính tổng kết, chữ, hệ 4) |
| GET    | `/students/me/gpa`           | SV    | GPA theo học kỳ                  |
| GET    | `/students/me/cpa`           | SV    | CPA hiện tại                     |
| GET    | `/students/me/stats`         | SV    | Thống kê tổng quan học tập sinh viên |
| GET    | `/students/me/schedule`      | SV    | Thời khóa biểu                   |
| GET    | `/students/me/classes`       | SV    | Các lớp đang tham gia            |
| GET    | `/students`                  | GV/AD | Danh sách sinh viên              |
| GET    | `/students/{masv}`           | GV/AD | Chi tiết sinh viên               |
| POST   | `/students`                  | AD    | Tạo sinh viên                    |
| PUT    | `/students/{masv}`           | AD    | Cập nhật sinh viên               |
| DELETE | `/students/{masv}`           | AD    | Xóa/disable sinh viên            |


### 3. Module giảng viên

| Method | Endpoint                 | Role | Description                      |
| ------ | ------------------------ | ---- | -------------------------------- |
| GET    | `/lecturers/me`          | GV   | Thông tin giảng viên hiện tại    |
| PUT    | `/lecturers/me`          | GV   | Cập nhật thông tin được phép sửa |
| GET    | `/lecturers/me/classes`  | GV   | Các lớp đang phụ trách           |
| GET    | `/lecturers/me/schedule` | GV   | Thời khóa biểu                   |
| GET    | `/lecturers`             | AD   | Danh sách giảng viên             |
| GET    | `/lecturers/{magv}`      | AD   | Chi tiết giảng viên              |
| POST   | `/lecturers`             | AD   | Tạo giảng viên                   |
| PUT    | `/lecturers/{magv}`      | AD   | Cập nhật giảng viên              |
| DELETE | `/lecturers/{magv}`      | AD   | Xóa/disable giảng viên           |


### 4. Module học phần

| Method | Endpoint          | Role     | Description        |
| ------ | ----------------- | -------- | ------------------ |
| GET    | `/courses`        | SV/GV/AD | Danh sách học phần |
| GET    | `/courses/{mahp}` | SV/GV/AD | Chi tiết học phần  |
| POST   | `/courses`        | AD       | Tạo học phần       |
| PUT    | `/courses/{mahp}` | AD       | Cập nhật học phần  |
| DELETE | `/courses/{mahp}` | AD       | Xóa học phần       |


### 5. Module lớp học

| Method | Endpoint                                     | Role     | Description         |
| ------ | -------------------------------------------- | -------- | ------------------- |
| GET    | `/classes`                                   | SV/GV/AD | Danh sách lớp học   |
| GET    | `/classes/{malh}`                            | SV/GV/AD | Chi tiết lớp        |
| POST   | `/classes`                                   | AD       | Tạo lớp             |
| PUT    | `/classes/{malh}`                            | AD       | Cập nhật lớp        |
| DELETE | `/classes/{malh}`                            | AD       | Xóa lớp             |
| GET    | `/classes/{malh}/students`                   | GV/AD    | Danh sách sinh viên |
| POST   | `/classes/{malh}/students/{masv}`            | AD       | Thêm SV vào lớp     |
| DELETE | `/classes/{malh}/students/{masv}`            | AD       | Xóa SV khỏi lớp     |
| GET    | `/classes/{malh}/lecturers`                  | SV/GV/AD | Danh sách GV        |
| POST   | `/classes/{malh}/lecturers/{magv}`           | AD       | Gán GV vào lớp      |
| DELETE | `/classes/{malh}/lecturers/{magv}`           | AD       | Bỏ GV khỏi lớp      |
| GET    | `/classes/{malh}/teaching-assistants`        | GV/AD    | Danh sách trợ giảng |
| POST   | `/classes/{malh}/teaching-assistants/{masv}` | AD       | Gán trợ giảng       |
| DELETE | `/classes/{malh}/teaching-assistants/{masv}` | AD       | Bỏ trợ giảng        |


### 6. Module điểm

| Method | Endpoint                        | Role  | Description               |
| ------ | ------------------------------- | ----- | ------------------------- |
| GET    | `/students/me/grades`           | SV    | Điểm của bản thân         |
| PUT    | `/students/me/grades/{malh}`    | SV    | Cập nhật điểm của bản thân theo lớp (HUST) |
| GET    | `/students/{masv}/grades`       | GV/AD | Điểm của sinh viên        |
| GET    | `/classes/{malh}/grades`        | GV/AD | Bảng điểm của lớp         |
| GET    | `/classes/{malh}/grades/{masv}` | GV/AD | Điểm của một SV trong lớp |
| POST   | `/classes/{malh}/grades`        | GV/AD | Nhập điểm                 |
| PUT    | `/classes/{malh}/grades/{masv}` | GV/AD | Cập nhật điểm             |
| DELETE | `/classes/{malh}/grades/{masv}` | AD    | Xóa điểm                  |


### 7. Module lịch học

| Method | Endpoint                     | Role     | Description     |
| ------ | ---------------------------- | -------- | --------------- |
| GET    | `/students/me/schedule`      | SV       | Lịch học        |
| GET    | `/students/{masv}/schedule`  | GV/AD    | Lịch học của SV |
| GET    | `/lecturers/me/schedule`     | GV       | Lịch giảng dạy  |
| GET    | `/lecturers/{magv}/schedule` | AD       | Lịch giảng dạy  |
| GET    | `/classes/{malh}/schedule`   | SV/GV/AD | Lịch của lớp    |
| POST   | `/classes/{malh}/schedule`   | AD       | Tạo lịch        |
| PUT    | `/schedule/{malichhoc}`      | AD       | Cập nhật lịch   |
| DELETE | `/schedule/{malichhoc}`      | AD       | Xóa lịch        |


### 8. Module bài tập và chia nhóm

| Method | Endpoint                          | Role     | Description                                           |
| ------ | --------------------------------- | -------- | ----------------------------------------------------- |
| GET    | `/assignments`                    | SV/GV/AD | Danh sách tất cả bài tập (hỗ trợ filter malh, search) |
| POST   | `/assignments`                    | SV/GV/AD | Tạo bài tập trực tiếp (kèm malh trong body)           |
| GET    | `/classes/{malh}/assignments`     | SV/GV/AD | Danh sách bài tập theo lớp                            |
| GET    | `/assignments/{mabt}`             | SV/GV/AD | Chi tiết bài tập                                      |
| POST   | `/classes/{malh}/assignments`     | GV/AD    | Tạo bài tập theo lớp                                  |
| PUT    | `/assignments/{mabt}`             | SV/GV/AD | Cập nhật bài tập                                      |
| PATCH  | `/assignments/{mabt}/toggle-status` | SV/GV/AD | Đảo trạng thái hoàn thành bài tập (completed / pending) |
| DELETE | `/assignments/{mabt}`             | SV/GV/AD | Xóa bài tập                                           |
| GET    | `/assignments/{mabt}/groups`      | SV/GV/AD | Danh sách nhóm                                        |
| GET    | `/groups/{manhom}`                | SV/GV/AD | Chi tiết nhóm     |
| POST   | `/assignments/{mabt}/groups`      | SV/GV/AD | Tạo nhóm          |
| PUT    | `/groups/{manhom}`                | SV/GV/AD | Cập nhật nhóm     |
| DELETE | `/groups/{manhom}`                | GV/AD    | Xóa nhóm          |
| GET    | `/groups/{manhom}/members`        | SV/GV/AD | Thành viên nhóm   |
| POST   | `/groups/{manhom}/members/{masv}` | SV/GV/AD | Thêm SV vào nhóm  |
| DELETE | `/groups/{manhom}/members/{masv}` | SV/GV/AD | Xóa SV khỏi nhóm  |


### 9. Module hoạt động ngoại khóa & điểm rèn luyện (DRL)

| Method | Endpoint                    | Role     | Description                                           |
| ------ | --------------------------- | -------- | ----------------------------------------------------- |
| GET    | `/activities`               | SV/GV/AD | Danh sách hoạt động ngoại khóa (filter category, reg) |
| POST   | `/activities/{id}/toggle`   | SV       | Đăng ký / Hủy đăng ký tham gia hoạt động              |
| GET    | `/activities/drl-summary`   | SV       | Bảng tổng hợp điểm rèn luyện và 5 tiêu chí HUST       |


