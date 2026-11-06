import {
  pgTable,
  serial,
  bigint,
  integer,
  varchar,
  text,
  decimal,
  numeric,
  timestamp,
  time,
  char,
  boolean,
  pgView,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =========================================================================
// 1. Module Tài Khoản & Auth
// =========================================================================

export const taiKhoan = pgTable("tai_khoan", {
  matk: serial("matk").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: char("role", { length: 2 }).notNull().default("SV"), // SV, GV, AD
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
  deletedBy: integer("deleted_by"),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  matk: integer("matk").notNull().references(() => taiKhoan.matk, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const taiKhoanRelations = relations(taiKhoan, ({ one, many }) => ({
  refreshTokens: many(refreshTokens),
  sinhVien: one(sinhVien, {
    fields: [taiKhoan.matk],
    references: [sinhVien.matk],
  }),
  giangVien: one(giangVien, {
    fields: [taiKhoan.matk],
    references: [giangVien.matk],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  taiKhoan: one(taiKhoan, {
    fields: [refreshTokens.matk],
    references: [taiKhoan.matk],
  }),
}));

// =========================================================================
// 2. Module Sinh Viên & Giảng Viên
// =========================================================================

export const sinhVien = pgTable("sinh_vien", {
  masv: integer("masv").primaryKey(), // MSSV (ví dụ: 20210001)
  matk: integer("matk").notNull().unique().references(() => taiKhoan.matk, { onDelete: "cascade" }),
  hoten: varchar("hoten", { length: 255 }).notNull(),
  gioiTinh: varchar("gioi_tinh", { length: 15 }).default("Nam"), // Đồng bộ varchar(15) theo Phase 1.1
  email: varchar("email", { length: 255 }),
  chuong_trinh: varchar("chuong_trinh", { length: 255 }).default("Chuẩn"),
  truong: varchar("truong", { length: 255 }).default("Trường CNTT & TT"),
  lop: varchar("lop", { length: 255 }).default("Việt Nhật 01"),
  khoa: integer("khoa").default(66), // K66
  trangThai: varchar("trang_thai", { length: 255 }).default("Học"),
  cpa: decimal("cpa", { precision: 4, scale: 2 }).default("0.00"), // decimal(4,2) chống tràn số
  deletedAt: timestamp("deleted_at"),
});

export const giangVien = pgTable("giang_vien", {
  magv: integer("magv").primaryKey(), // Mã GV (ví dụ: 82)
  matk: integer("matk").notNull().unique().references(() => taiKhoan.matk, { onDelete: "cascade" }),
  hoten: varchar("hoten", { length: 255 }).notNull(),
  gioiTinh: varchar("gioi_tinh", { length: 15 }).default("Nữ"),
  email: varchar("email", { length: 255 }),
  truong: varchar("truong", { length: 255 }).default("Bộ môn Công nghệ Phần mềm"),
  deletedAt: timestamp("deleted_at"),
});

// =========================================================================
// 3. Module Học Phần & Lớp Học
// =========================================================================

export const hocPhan = pgTable("hoc_phan", {
  mahp: char("mahp", { length: 10 }).primaryKey(), // ví dụ: IT3040
  ten: varchar("ten", { length: 255 }).notNull(),
  truong: varchar("truong", { length: 255 }),
  batBuoc: boolean("bat_buoc").default(false),
  tinChiDaoTao: integer("tin_chi_dao_tao").default(3),
  tinChiHocPhi: integer("tin_chi_hoc_phi").default(3),
  phanBo: char("phan_bo", { length: 15 }), // ví dụ: "3(2-1-0-6)"
  noiDung: text("noidung"),
  deletedAt: timestamp("deleted_at"),
});

export const lopHoc = pgTable("lop_hoc", {
  malh: serial("malh").primaryKey(),
  mahp: char("mahp", { length: 10 }).notNull().references(() => hocPhan.mahp),
  malop: char("malop", { length: 6 }).notNull(), // mã lớp mở trên TKB: ví dụ "145678"
  hocKy: char("hoc_ky", { length: 5 }).notNull().default("20261"),
  hocKyPhu: char("hoc_ky_phu", { length: 2 }).default("AB"),
  malhLt: integer("malh_lt"), // Nullable theo Guardrail 3 / Phase 1.1 cho lớp lý thuyết độc lập
  loai: char("loai", { length: 10 }).default("LT+BT"), // LT, BT, LT+BT, TN, DA
  trongsoQt: decimal("trongso_qt", { precision: 3, scale: 2 }).notNull().default("0.40"), // Guardrail 3
  hinhthucGiangday: char("hinhthuc_giangday", { length: 15 }).default("Offline"),
  deletedAt: timestamp("deleted_at"),
});

// Quan hệ phân công & đăng ký lớp
export const svLh = pgTable(
  "sv_lh",
  {
    masv: integer("masv").notNull().references(() => sinhVien.masv, { onDelete: "cascade" }),
    malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.masv, t.malh] })]
);

export const gvLh = pgTable(
  "gv_lh",
  {
    magv: integer("magv").notNull().references(() => giangVien.magv, { onDelete: "cascade" }),
    malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.magv, t.malh] })]
);

export const teacherAssistant = pgTable(
  "teacher_assistant",
  {
    masv: integer("masv").notNull().references(() => sinhVien.masv, { onDelete: "cascade" }),
    malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.masv, t.malh] })]
);

// Bảng đăng ký lớp học (Phase 1.1)
export const dangKyLop = pgTable("dang_ky_lop", {
  madk: serial("madk").primaryKey(),
  masv: integer("masv").notNull().references(() => sinhVien.masv, { onDelete: "cascade" }),
  malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
  ngayDangKy: timestamp("ngay_dang_ky").defaultNow(),
  trangThai: varchar("trang_thai", { length: 50 }).default("DangHoc"), // DangHoc, DaHuy, RutHocPhan
});

// =========================================================================
// 4. Module Lịch Học & Tiết Học
// =========================================================================

export const tietHoc = pgTable("tiet_hoc", {
  tietHocSo: integer("tiet_hoc_so").primaryKey(), // 1, 2, ..., 12
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
});

export const lichHoc = pgTable("lich_hoc", {
  malichhoc: serial("malichhoc").primaryKey(),
  malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
  ngayTrongTuan: integer("ngay_trong_tuan").notNull(), // 2 (Thứ 2) -> 8 (Chủ nhật)
  tietBatDau: integer("tiet_bat_dau").notNull().references(() => tietHoc.tietHocSo),
  tietKetThuc: integer("tiet_ket_thuc").notNull().references(() => tietHoc.tietHocSo),
  diaDiem: varchar("dia_diem", { length: 20 }).notNull(), // vd: "D3-5", "B1"
  phongHoc: varchar("phong_hoc", { length: 50 }),
});

export const tuanHoc = pgTable(
  "tuan_hoc",
  {
    math: serial("math").primaryKey(),
    malichhoc: integer("malichhoc").notNull().references(() => lichHoc.malichhoc, { onDelete: "cascade" }),
    tuanSo: integer("tuan_so").notNull(),
  },
  (t) => [uniqueIndex("idx_tuan_hoc_malichhoc_tuan").on(t.malichhoc, t.tuanSo)]
);

// =========================================================================
// 5. Module Điểm Số
// =========================================================================

export const diem = pgTable(
  "diem",
  {
    madiem: serial("madiem").primaryKey(),
    masv: integer("masv").notNull().references(() => sinhVien.masv, { onDelete: "cascade" }),
    malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
    diemQt: decimal("diem_qt", { precision: 4, scale: 2 }), // Quá trình (hệ 10)
    diemCk: decimal("diem_ck", { precision: 4, scale: 2 }), // Cuối kỳ (hệ 10)
  },
  (t) => [uniqueIndex("idx_diem_masv_malh").on(t.masv, t.malh)]
);

// =========================================================================
// 6. Module Bài Tập & Chia Nhóm
// =========================================================================

export const baiTap = pgTable("bai_tap", {
  mabt: serial("mabt").primaryKey(),
  malh: integer("malh").notNull().references(() => lopHoc.malh, { onDelete: "cascade" }),
  loai: varchar("loai", { length: 255 }).default("Bài tập lớn"),
  noiDung: text("noi_dung"),
  deadline: timestamp("deadline"),
  deletedAt: timestamp("deleted_at"),
});

export const nhom = pgTable("nhom", {
  manhom: serial("manhom").primaryKey(),
  mabt: integer("mabt").notNull().references(() => baiTap.mabt, { onDelete: "cascade" }),
  deTai: text("de_tai"),
  deletedAt: timestamp("deleted_at"),
});

export const nhomSv = pgTable(
  "nhom_sv",
  {
    manhom: integer("manhom").notNull().references(() => nhom.manhom, { onDelete: "cascade" }),
    masv: integer("masv").notNull().references(() => sinhVien.masv, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.manhom, t.masv] })]
);

// =========================================================================
// 7. Supabase Real-Data Tables (Legacy & Full-TKB support)
// =========================================================================

export const courses = pgTable("courses", {
  id: varchar("id", { length: 50 }).primaryKey(),
  nameVi: text("name_vi").notNull(),
  nameEn: text("name_en"),
  creditCode: varchar("credit_code", { length: 50 }),
  courseUnits: numeric("course_units", { precision: 4, scale: 1 }),
  theoryHours: numeric("theory_hours", { precision: 4, scale: 1 }),
  exerciseHours: numeric("exercise_hours", { precision: 4, scale: 1 }),
  labHours: numeric("lab_hours", { precision: 4, scale: 1 }),
  selfStudyHours: numeric("self_study_hours", { precision: 4, scale: 1 }),
  tuitionUnits: numeric("tuition_units", { precision: 4, scale: 1 }),
  examFactor: numeric("exam_factor", { precision: 4, scale: 2 }),
  isOffered20261: boolean("is_offered_20261").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  classCode: varchar("class_code", { length: 50 }).primaryKey(),
  semester: varchar("semester", { length: 20 }).notNull(),
  courseId: varchar("course_id", { length: 50 }).notNull().references(() => courses.id),
  pairedClassCode: varchar("paired_class_code", { length: 50 }),
  departmentCode: varchar("department_code", { length: 50 }).notNull(),
  classType: varchar("class_type", { length: 20 }).notNull(),
  openBatch: varchar("open_batch", { length: 20 }),
  programCode: varchar("program_code", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull(),
  maxStudents: integer("max_students").notNull().default(0),
  registeredStudents: integer("registered_students").default(0),
  needsExperiment: boolean("needs_experiment").notNull().default(false),
  teachingType: varchar("teaching_type", { length: 50 }),
  notes: text("notes"),
  warningNote: text("warning_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classSchedules = pgTable("class_schedules", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  classCode: varchar("class_code", { length: 50 }).notNull().references(() => classes.classCode),
  sessionNumber: integer("session_number"),
  dayOfWeek: integer("day_of_week"),
  dayNameVi: varchar("day_name_vi", { length: 20 }),
  startTime: time("start_time"),
  endTime: time("end_time"),
  timeRange: varchar("time_range", { length: 50 }),
  startPeriod: varchar("start_period", { length: 10 }),
  endPeriod: varchar("end_period", { length: 10 }),
  shift: varchar("shift", { length: 20 }),
  room: varchar("room", { length: 50 }),
  weeksRaw: varchar("weeks_raw", { length: 255 }),
  weeksArray: integer("weeks_array").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const viewTkbFull = pgView("view_tkb_full", {
  semester: varchar("semester"),
  departmentCode: varchar("department_code"),
  classCode: varchar("class_code"),
  pairedClassCode: varchar("paired_class_code"),
  courseId: varchar("course_id"),
  courseNameVi: text("course_name_vi"),
  courseNameEn: text("course_name_en"),
  creditCode: varchar("credit_code"),
  courseUnits: numeric("course_units"),
  tuitionUnits: numeric("tuition_units"),
  examFactor: numeric("exam_factor"),
  classType: varchar("class_type"),
  openBatch: varchar("open_batch"),
  programCode: varchar("program_code"),
  classStatus: varchar("class_status"),
  registeredStudents: integer("registered_students"),
  maxStudents: integer("max_students"),
  needsExperiment: boolean("needs_experiment"),
  teachingType: varchar("teaching_type"),
  classNotes: text("class_notes"),
  warningNote: text("warning_note"),
  scheduleId: bigint("schedule_id", { mode: "number" }),
  sessionNumber: integer("session_number"),
  dayOfWeek: integer("day_of_week"),
  dayNameVi: varchar("day_name_vi"),
  timeRange: varchar("time_range"),
  startTime: time("start_time"),
  endTime: time("end_time"),
  startPeriod: varchar("start_period"),
  endPeriod: varchar("end_period"),
  shift: varchar("shift"),
  room: varchar("room"),
  weeksRaw: varchar("weeks_raw"),
  weeksArray: integer("weeks_array").array(),
}).existing();
