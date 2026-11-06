import bcrypt from "bcrypt";
import { client } from "./index.js";

export async function runSeeds() {
  try {
    console.log("=== Seeding Minimal ERD Database ===");
    const saltRounds = 10;
    const adminHash = await bcrypt.hash("admin123", saltRounds);
    const userHash = await bcrypt.hash("123456", saltRounds);

    // 1. Tiết học (1 đến 12)
    console.log("Seeding tiet_hoc...");
    await client`
      INSERT INTO tiet_hoc (tiet_hoc_so, start_time, end_time) VALUES
        (1, '06:45:00', '07:30:00'),
        (2, '07:30:00', '08:15:00'),
        (3, '08:25:00', '09:10:00'),
        (4, '09:20:00', '10:05:00'),
        (5, '10:15:00', '11:00:00'),
        (6, '11:00:00', '11:45:00'),
        (7, '12:30:00', '13:15:00'),
        (8, '13:15:00', '14:00:00'),
        (9, '14:10:00', '14:55:00'),
        (10, '15:05:00', '15:50:00'),
        (11, '16:00:00', '16:45:00'),
        (12, '16:45:00', '17:30:00')
      ON CONFLICT (tiet_hoc_so) DO NOTHING;
    `;

    // 2. Tài khoản (admin, gv_huong, sv_20210001, sv_20210002)
    console.log("Seeding tai_khoan...");
    await client`
      INSERT INTO tai_khoan (matk, username, password, role) VALUES
        (1, 'admin', ${adminHash}, 'AD'),
        (2, 'gv_huong', ${userHash}, 'GV'),
        (3, 'sv_20210001', ${userHash}, 'SV'),
        (4, 'sv_20210002', ${userHash}, 'SV')
      ON CONFLICT (username) DO NOTHING;
    `;

    // 3. Sinh viên
    console.log("Seeding sinh_vien...");
    await client`
      INSERT INTO sinh_vien (masv, matk, hoten, gioi_tinh, email, chuong_trinh, truong, lop, khoa, trang_thai, cpa) VALUES
        (20210001, 3, 'Nguyễn Văn An', 'Nam', 'an.nv210001@sis.hust.edu.vn', 'CNPM', 'Trường CNTT & TT', 'K66 - CNPM 01', 66, 'Học', 3.42),
        (20210002, 4, 'Trần Thị Mai', 'Nữ', 'mai.tt210002@sis.hust.edu.vn', 'CNPM', 'Trường CNTT & TT', 'K66 - CNPM 02', 66, 'Học', 3.65)
      ON CONFLICT (masv) DO NOTHING;
    `;

    // 4. Giảng viên
    console.log("Seeding giang_vien...");
    await client`
      INSERT INTO giang_vien (magv, matk, hoten, gioi_tinh, email, truong) VALUES
        (82, 2, 'TS. Nguyễn Thu Hường', 'Nữ', 'huong.nt@soict.hust.edu.vn', 'Bộ môn Công nghệ Phần mềm')
      ON CONFLICT (magv) DO NOTHING;
    `;

    // 5. Học phần
    console.log("Seeding hoc_phan...");
    await client`
      INSERT INTO hoc_phan (mahp, ten, truong, bat_buoc, tin_chi_dao_tao, tin_chi_hoc_phi, phan_bo, noidung) VALUES
        ('IT3040', 'Kỹ thuật phần mềm', 'Trường CNTT & TT', true, 3, 3, '3(2-1-0-6)', 'Quy trình phát triển phần mềm Agile/Scrum, thiết kế UML, kiến trúc phần mềm.'),
        ('IT3080', 'Mạng máy tính', 'Trường CNTT & TT', true, 3, 3, '3(2-1-0-6)', 'Mô hình OSI, TCP/IP, Routing, Switching, giao thức tầng ứng dụng.'),
        ('IT3100', 'Cơ sở dữ liệu', 'Trường CNTT & TT', true, 3, 3, '3(2-1-0-6)', 'Mô hình quan hệ ERD, SQL chuẩn, thiết kế cơ sở dữ liệu, chỉ mục và transaction.'),
        ('IT4015', 'Kiến trúc hệ thống phần mềm', 'Trường CNTT & TT', false, 3, 3, '3(2-1-0-6)', 'Microservices, Event-driven architecture, High Availability và Caching.'),
        ('MI1110', 'Giải tích 1', 'Viện Toán ứng dụng & Tin học', true, 4, 4, '4(3-2-0-8)', 'Phép tính vi phân và tích phân hàm một biến số.')
      ON CONFLICT (mahp) DO NOTHING;
    `;

    // 6. Lớp học (Đảm bảo Guardrail 3: trongso_qt rõ ràng)
    console.log("Seeding lop_hoc...");
    await client`
      INSERT INTO lop_hoc (malh, mahp, malop, hoc_ky, hoc_ky_phu, loai, trongso_qt, hinhthuc_giangday) VALUES
        (1, 'IT3040', '145678', '20261', 'AB', 'LT+BT', 0.40, 'Offline'),
        (2, 'IT3080', '145679', '20261', 'AB', 'LT+BT', 0.40, 'Offline'),
        (3, 'IT3100', '145680', '20261', 'AB', 'LT+BT', 0.30, 'Offline'),
        (4, 'IT4015', '145681', '20261', 'AB', 'LT+BT', 0.40, 'Offline')
      ON CONFLICT (malop, hoc_ky) DO NOTHING;
    `;

    // 7. Phân công & Đăng ký lớp
    console.log("Seeding gv_lh, sv_lh, dang_ky_lop...");
    await client`
      INSERT INTO gv_lh (magv, malh) VALUES
        (82, 1),
        (82, 2),
        (82, 4)
      ON CONFLICT (magv, malh) DO NOTHING;
    `;

    await client`
      INSERT INTO sv_lh (masv, malh) VALUES
        (20210001, 1),
        (20210001, 2),
        (20210001, 3),
        (20210002, 1),
        (20210002, 4)
      ON CONFLICT (masv, malh) DO NOTHING;
    `;

    await client`
      INSERT INTO dang_ky_lop (masv, malh, trang_thai) VALUES
        (20210001, 1, 'DangHoc'),
        (20210001, 2, 'DangHoc'),
        (20210001, 3, 'DangHoc'),
        (20210002, 1, 'DangHoc'),
        (20210002, 4, 'DangHoc')
      ON CONFLICT (masv, malh) DO NOTHING;
    `;

    await client`
      INSERT INTO teacher_assistant (masv, malh) VALUES
        (20210002, 3)
      ON CONFLICT (masv, malh) DO NOTHING;
    `;

    // 8. Lịch học
    console.log("Seeding lich_hoc & tuan_hoc...");
    await client`
      INSERT INTO lich_hoc (malichhoc, malh, ngay_trong_tuan, tiet_bat_dau, tiet_ket_thuc, dia_diem, phong_hoc) VALUES
        (1, 1, 2, 1, 3, 'D3-5', 'D3-5-201'),
        (2, 2, 3, 7, 9, 'B1', 'B1-302'),
        (3, 3, 4, 4, 6, 'D9', 'D9-401'),
        (4, 4, 5, 1, 3, 'TC', 'TC-101')
      ON CONFLICT (malichhoc) DO NOTHING;
    `;

    // 9. Điểm số (Guardrail 3)
    console.log("Seeding diem...");
    await client`
      INSERT INTO diem (masv, malh, diem_qt, diem_ck) VALUES
        (20210001, 1, 8.5, 8.0),
        (20210001, 2, 9.0, 9.0),
        (20210001, 3, 7.5, 8.0),
        (20210002, 1, 9.5, 9.0),
        (20210002, 4, 8.0, 8.5)
      ON CONFLICT (masv, malh) DO NOTHING;
    `;

    // 10. Bài tập & Nhóm
    console.log("Seeding bai_tap, nhom, nhom_sv...");
    await client`
      INSERT INTO bai_tap (mabt, malh, loai, noi_dung, deadline) VALUES
        (1, 1, 'Bài tập lớn', 'Thiết kế kiến trúc hệ thống và xây dựng prototype cho CNPM-QLHT', NOW() + INTERVAL '14 days'),
        (2, 2, 'Thực hành mạng', 'Cấu hình Router Cisco và phân tích gói tin qua Wireshark', NOW() + INTERVAL '7 days')
      ON CONFLICT (mabt) DO NOTHING;
    `;

    await client`
      INSERT INTO nhom (manhom, mabt, de_tai) VALUES
        (1, 1, 'Nhóm 01: Hệ thống Quản lý Học tập sinh viên ĐHBK Hà Nội')
      ON CONFLICT (manhom) DO NOTHING;
    `;

    await client`
      INSERT INTO nhom_sv (manhom, masv) VALUES
        (1, 20210001),
        (1, 20210002)
      ON CONFLICT (manhom, masv) DO NOTHING;
    `;

    console.log("✅ Seed completed successfully with realistic sample data!");
  } catch (error: any) {
    console.error("❌ Seed failed:", error.message || error);
    throw error;
  }
}

// Chạy trực tiếp qua CLI
if (require.main === module || process.argv[1]?.includes("seed")) {
  runSeeds()
    .then(async () => {
      await client.end();
      process.exit(0);
    })
    .catch(async () => {
      await client.end();
      process.exit(1);
    });
}

