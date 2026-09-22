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


Note 1: MVP trước mắt chưa thực hiện Authentication vội, nhưng trong Swagger tôi vẫn để tạm là dùng JWT
```yaml
bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
```

Note 2: Có thể xem format request / response trong Swagger rồi định nghĩa type tương ứng cho request / response trong frontend

Note 3: Method `DELETE` hiện tại là Soft Delete, tức là thay vì xóa cứng (thực tế khi phát triển phần mềm, không ai xóa cứng dữ liệu cả), thì ae xóa mềm bằng cách update 2 trường `deleted_at` (timestamp - xóa lúc nào) và `deleted_by` (giá trị là ID của người xóa, trong database tôi đang định nghĩa là trường `matk` của bảng `tai_khoan`, tức là xóa bởi ai). Khi trả kết quả query về cho frontend thì sẽ chỉ lấy các record mà 2 trường deleted kia là `null`.

Note 4: Ae để ý phần phân quyền, trong bảng `tai_khoan` có field là `role`, với 3 giá trị tôi đã viết ở bảng trên. Trong các API bên dưới tôi cũng sẽ liệt kê các Role được quyền gọi API tương ứng.

Note 5: 2000 dòng của cái file định nghĩa API cho Swagger (file `docs/api_doc_openapi.yaml`) là do AI gen (đương nhiên tôi viết hết thế quái nào được 2k dòng), nên nếu có sai sót hay lấn cấn thì báo lại cho tôi (Huy)


## Swagger UI (OpenAPI)
+ URL: `{backend_url}/api/docs`



## APIs

Mỗi module tương ứng với từng Table trong [ERD](./ERD.png)

### 1. Module tài khoản

| Method | Endpoint           | Role     | Description            |
| ------ | ------------------ | -------- | ---------------------- |
| POST   | `/auth/login`      | Public   | Đăng nhập              |
| POST   | `/auth/logout`     | SV/GV/AD | Đăng xuất              |
| GET    | `/accounts/me`     | SV/GV/AD | Lấy tài khoản hiện tại |
| GET    | `/accounts`        | AD       | Danh sách tài khoản    |
| GET    | `/accounts/{matk}` | AD       | Chi tiết tài khoản     |
| POST   | `/accounts`        | AD       | Tạo tài khoản          |
| PUT    | `/accounts/{matk}` | AD       | Cập nhật tài khoản     |
| DELETE | `/accounts/{matk}` | AD       | Soft delete tài khoản  |


### 2. Module sinh viên

| Method | Endpoint                     | Role  | Description                      |
| ------ | ---------------------------- | ----- | -------------------------------- |
| GET    | `/students/me`               | SV    | Thông tin sinh viên hiện tại     |
| PUT    | `/students/me`               | SV    | Cập nhật thông tin được phép sửa |
| GET    | `/students/me/grades`        | SV    | Xem toàn bộ điểm                 |
| GET    | `/students/me/grades/{malh}` | SV    | Xem điểm một lớp                 |
| GET    | `/students/me/gpa`           | SV    | GPA theo học kỳ                  |
| GET    | `/students/me/cpa`           | SV    | CPA hiện tại                     |
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

| Method | Endpoint                          | Role     | Description       |
| ------ | --------------------------------- | -------- | ----------------- |
| GET    | `/classes/{malh}/assignments`     | SV/GV/AD | Danh sách bài tập |
| GET    | `/assignments/{mabt}`             | SV/GV/AD | Chi tiết bài tập  |
| POST   | `/classes/{malh}/assignments`     | GV/AD    | Tạo bài tập       |
| PUT    | `/assignments/{mabt}`             | GV/AD    | Cập nhật bài tập  |
| DELETE | `/assignments/{mabt}`             | GV/AD    | Xóa bài tập       |
| GET    | `/assignments/{mabt}/groups`      | SV/GV/AD | Danh sách nhóm    |
| GET    | `/groups/{manhom}`                | SV/GV/AD | Chi tiết nhóm     |
| POST   | `/assignments/{mabt}/groups`      | SV/GV/AD | Tạo nhóm          |
| PUT    | `/groups/{manhom}`                | SV/GV/AD | Cập nhật nhóm     |
| DELETE | `/groups/{manhom}`                | GV/AD    | Xóa nhóm          |
| GET    | `/groups/{manhom}/members`        | SV/GV/AD | Thành viên nhóm   |
| POST   | `/groups/{manhom}/members/{masv}` | SV/GV/AD | Thêm SV vào nhóm  |
| DELETE | `/groups/{manhom}/members/{masv}` | SV/GV/AD | Xóa SV khỏi nhóm  |


