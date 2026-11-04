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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Tài khoản
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

// 1.1 Refresh Tokens (Quản lý phiên đăng nhập và xoay vòng Refresh Token)
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

export const taiKhoanRelations = relations(taiKhoan, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  taiKhoan: one(taiKhoan, {
    fields: [refreshTokens.matk],
    references: [taiKhoan.matk],
  }),
}));

// 2. Học phần
export const hocPhan = pgTable("hoc_phan", {
  mahp: char("mahp", { length: 10 }).primaryKey(),
  ten: varchar("ten", { length: 255 }).notNull(),
  truong: varchar("truong", { length: 255 }),
  batBuoc: boolean("bat_buoc").default(false),
  tinChiDaoTao: integer("tin_chi_dao_tao").default(0),
  tinChiHocPhi: integer("tin_chi_hoc_phi").default(0),
  phanBo: char("phan_bo", { length: 7 }),
  noiDung: text("noidung"),
  deletedAt: timestamp("deleted_at"),
});

// 3. Lớp học (Đảm bảo Guardrail 3: trongso_qt & malh_lt nullable)
export const lopHoc = pgTable("lop_hoc", {
  malh: serial("malh").primaryKey(),
  mahp: char("mahp", { length: 10 }).notNull().references(() => hocPhan.mahp),
  malop: char("malop", { length: 6 }).notNull(),
  hocKy: char("hoc_ky", { length: 5 }).notNull(),
  hocKyPhu: char("hoc_ky_phu", { length: 2 }).default("AB"),
  malhLt: integer("malh_lt"), // Nullable cho lớp LT độc lập
  loai: char("loai", { length: 5 }), // LT, BT, LT+BT, TN, DA
  trongsoQt: decimal("trongso_qt", { precision: 3, scale: 2 }).notNull().default("0.40"),
  hinhthucGiangday: char("hinhthuc_giangday", { length: 10 }).default("Offline"),
  deletedAt: timestamp("deleted_at"),
});

// 4. Điểm sinh viên
export const diem = pgTable("diem", {
  madiem: serial("madiem").primaryKey(),
  masv: integer("masv").notNull(),
  malh: integer("malh").notNull().references(() => lopHoc.malh),
  diemQt: decimal("diem_qt", { precision: 4, scale: 2 }),
  diemCk: decimal("diem_ck", { precision: 4, scale: 2 }),
});

// =========================================================================
// 5. Hệ thống Thời Khóa Biểu & Học Phần thực tế từ Supabase
// (courses: 8,270 môn | classes: 11,011 lớp | class_schedules: 14,008 ca học)
// =========================================================================

// 5.1 Bảng Học Phần (courses)
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

// 5.2 Bảng Lớp Học (classes)
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

// 5.3 Bảng Lịch Học / Thời Khóa Biểu (class_schedules)
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

// 5.4 Quan hệ giữa các bảng (Relations)
export const coursesRelations = relations(courses, ({ many }) => ({
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  course: one(courses, {
    fields: [classes.courseId],
    references: [courses.id],
  }),
  pairedClass: one(classes, {
    fields: [classes.pairedClassCode],
    references: [classes.classCode],
    relationName: "pairedClassRelation",
  }),
  schedules: many(classSchedules),
}));

export const classSchedulesRelations = relations(classSchedules, ({ one }) => ({
  class: one(classes, {
    fields: [classSchedules.classCode],
    references: [classes.classCode],
  }),
}));

// 5.5 View tổng hợp TKB (view_tkb_full)
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
