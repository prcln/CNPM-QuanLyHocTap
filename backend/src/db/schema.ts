import { pgTable, serial, integer, varchar, text, decimal, timestamp, char, boolean } from "drizzle-orm/pg-core";
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
