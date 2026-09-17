## Quy uoc
+ Base url: `/api/v1`
+ Data format: `JSON`
+ Roles: Sinh viên (SV), Giảng viên (GV), Admin (AD)
+ Note: Soft delete thay vì dùng method DELETE cứng


## APIs

Mỗi module tương ứng với từng Table trong [ERD](./ERD.png)

### 1. Module tài khoản

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| POST   | `/auth/login`     | SV, GV, AD | Đăng nhập |
| POST   | `/auth/logout`    | SV, GV, AD | Đăng xuất |
| GET    | `/auth/me`        | SV, GV, AD | Lấy thông tin tài khoản hiện tại |
| PUT    | `/auth/password`  | SV, GV, AD | Đổi mật khẩu |
| GET    | `/accounts`       | AD         | Danh sách tài khoản |
| GET    | `/accounts/:matk` | AD         | Xem thông tin tài khoản |
| POST   | `/accounts`       | AD         | Tạo tài khoản |
| PUT    | `/accounts/:matk` | AD         | Cập nhật tài khoản |
| DELETE | `/accounts/:matk` | AD         | Xóa tài khoản |


### 2. Module sinh viên

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/students/me`    | SV         | Xem thông tin cá nhân |
| PUT    | `/students/me`    | SV         | Cập nhật thông tin cá nhân được phép sửa |
| GET    | `/students/:masv` | AD, GV     | Xem thông tin sinh viên |
| GET    | `/students`       | AD, GV     | Danh sách sinh viên |
| POST   | `/students`       | AD         | Tạo sinh viên |
| PUT    | `/students/:masv` | AD         | Cập nhật thông tin sinh viên |
| DELETE | `/students/:masv` | AD         | Xóa sinh viên |


### 3. Module giảng viên

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/lecturers/me`             | GV        | Xem thông tin cá nhân |
| PUT    | `/lecturers/me`             | GV        | Cập nhật thông tin cá nhân được phép sửa |
| GET    | `/lecturers/:magv`          | AD        | Xem thông tin giảng viên |
| GET    | `/lecturers`                | AD        | Danh sách giảng viên |
| POST   | `/lecturers`                | AD        | Tạo giảng viên |
| PUT    | `/lecturers/:magv`          | AD        | Cập nhật thông tin giảng viên |
| DELETE | `/lecturers/:magv`          | AD        | Xóa/vô hiệu hóa giảng viên |
| GET    | `/lecturers/:magv/classes`  | GV, AD    | Danh sách lớp của giảng viên |


### 4. Module học phần

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/courses`         | SV, GV, AD | Danh sách học phần |
| GET    | `/courses/:mahp`   | SV, GV, AD | Xem thông tin học phần |
| POST   | `/courses`         | AD         | Tạo học phần |
| PUT    | `/courses/:mahp`   | AD         | Cập nhật học phần |
| DELETE | `/courses/:mahp`   | AD         | Xóa học phần |


### 5. Module lớp học

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/classes`                       | SV, GV, AD | Danh sách các lớp học |
| GET    | `/classes/:malh`                 | SV, GV, AD | Chi tiết lớp học |
| POST   | `/classes`                       | AD         | Tạo lớp học |
| PUT    | `/classes/:malh`                 | AD         | Cập nhật lớp học |
| DELETE | `/classes/:malh`                 | AD         | Xóa lớp học |
| GET    | `/classes/:malh/students`        | GV, AD     | Danh sách sinh viên trong lớp |
| GET    | `/classes/:malh/lecturers`       | GV, AD     | Danh sách giảng viên phụ trách lớp |
| GET    | `/classes/:malh/lecturers`       | GV, AD     | Xem giảng viên của lớp |
| POST   | `/classes/:malh/lecturers`       | AD         | Phân công giảng viên |
| DELETE | `/classes/:malh/lecturers/:magv` | AD         | Hủy phân công giảng viên |


### 6. Module điểm

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/students/me/grades`         | SV         | Xem toàn bộ điểm |
| GET    | `/students/me/grades/:malh`   | SV         | Xem điểm một lớp |
| GET    | `/students/:masv/grades`      | GV, AD     | Xem điểm của sinh viên |
| GET    | `/classes/:malh/grades`       | GV, AD     | Xem bảng điểm của lớp |
| PUT    | `/classes/:malh/grades/:masv` | GV, AD     | Cập nhật điểm sinh viên |
| POST   | `/classes/:malh/grades`       | GV, AD     | Nhập điểm |
| DELETE | `/classes/:malh/grades/:masv` | AD         | Xóa điểm |
| GET    | `/students/me/gpa`            | SV         | GPA từng học kỳ |
| GET    | `/students/me/cpa`            | SV         | CPA tích lũy    |
| GET    | `/students/:masv/gpa`         | GV, AD     | GPA từng học kỳ |
| GET    | `/students/:masv/cpa`         | GV, AD     | CPA tích lũy    |


### 7. Module thời khóa biểu

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/students/me/schedule`     | SV         | Thời khóa biểu của sinh viên |
| GET    | `/students/:masv/schedule`  | GV, AD     | Xem thời khóa biểu sinh viên |
| GET    | `/lecturers/me/schedule`    | GV         | Thời khóa biểu giảng viên |
| GET    | `/lecturers/:magv/schedule` | AD         | Thời khóa biểu giảng viên |
| GET    | `/classes/:malh/schedule`   | SV, GV, AD | Lịch học của lớp |
| POST   | `/classes/:malh/schedule`   | AD         | Tạo lịch học |
| PUT    | `/schedule/:malichhoc`      | AD         | Sửa lịch học |
| DELETE | `/schedule/:malichhoc`      | AD         | Xóa lịch học |


### 8. Module bài tập và chia nhóm
| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET    | `/classes/:malh/assignments`    | SV, GV, AD | Danh sách bài tập |
| GET    | `/assignments/:mabt`            | SV, GV, AD | Chi tiết bài tập  |
| POST   | `/classes/:malh/assignments`    | GV, AD     | Tạo bài tập       |
| PUT    | `/assignments/:mabt`            | GV, AD     | Cập nhật bài tập  |
| DELETE | `/assignments/:mabt`            | GV, AD     | Xóa bài tập       |
| GET    | `/assignments/:mabt/groups`     | SV, GV, AD | Danh sách nhóm       |
| GET    | `/groups/:manhom`               | SV, GV, AD | Chi tiết nhóm        |
| POST   | `/assignments/:mabt/groups`     | SV, GV, AD | Tạo nhóm             |
| PUT    | `/groups/:manhom`               | SV, GV, AD | Cập nhật đề tài nhóm |
| DELETE | `/groups/:manhom`               | GV, AD     | Xóa nhóm             |
| POST   | `/groups/:manhom/members`       | SV, GV, AD | Thêm thành viên      |
| DELETE | `/groups/:manhom/members/:masv` | SV, GV, AD | Xóa thành viên       |
| GET    | `/groups/:manhom/members`       | SV, GV, AD | Danh sách thành viên |


