import { eq, and, isNull, count, ilike, or, SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { lopHoc, hocPhan, svLh, gvLh, teacherAssistant, sinhVien, giangVien } from "../db/schema.js";

export interface ClassData {
  malh: number;
  mahp: string;
  malop: string;
  hocKy: string;
  hocKyPhu?: string | null;
  malhLt?: number | null;
  loai?: string | null;
  trongsoQt: string;
  hinhthucGiangday?: string | null;
  deletedAt?: Date | null;
  tenHocPhan?: string;
}

let memoryClasses: ClassData[] = [
  { malh: 1, mahp: "IT3040", malop: "145678", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", hinhthucGiangday: "Offline", tenHocPhan: "Kỹ thuật phần mềm" },
  { malh: 2, mahp: "IT3080", malop: "145679", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", hinhthucGiangday: "Offline", tenHocPhan: "Mạng máy tính" },
  { malh: 3, mahp: "IT3100", malop: "145680", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.30", hinhthucGiangday: "Offline", tenHocPhan: "Cơ sở dữ liệu" },
  { malh: 4, mahp: "IT4015", malop: "145681", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", hinhthucGiangday: "Offline", tenHocPhan: "Kiến trúc hệ thống phần mềm" },
];

let memorySvLh: { malh: number; masv: number }[] = [
  { malh: 1, masv: 20210001 },
  { malh: 1, masv: 20210002 },
  { malh: 2, masv: 20210001 },
  { malh: 3, masv: 20210001 },
  { malh: 4, masv: 20210002 },
];

let memoryGvLh: { malh: number; magv: number }[] = [
  { malh: 1, magv: 82 },
  { malh: 2, magv: 82 },
  { malh: 4, magv: 82 },
];

let memoryTa: { malh: number; masv: number }[] = [
  { malh: 3, masv: 20210002 },
];

export class ClassRepository {
  async findAll(filters: { semester?: string; courseId?: string; search?: string; limit?: number; offset?: number } = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    try {
      const conditions: (SQL<unknown> | undefined)[] = [isNull(lopHoc.deletedAt)];
      if (filters.semester) conditions.push(eq(lopHoc.hocKy, filters.semester));
      if (filters.courseId) conditions.push(eq(lopHoc.mahp, filters.courseId));
      if (filters.search) {
        const kw = `%${filters.search.trim()}%`;
        conditions.push(or(ilike(lopHoc.malop, kw), ilike(lopHoc.mahp, kw), ilike(hocPhan.ten, kw)));
      }

      const validConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined);
      const whereClause = validConditions.length > 0 ? and(...validConditions) : undefined;

      const [totalRec] = await db
        .select({ total: count() })
        .from(lopHoc)
        .leftJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(whereClause);

      const rows = await db
        .select({
          malh: lopHoc.malh,
          mahp: lopHoc.mahp,
          malop: lopHoc.malop,
          hocKy: lopHoc.hocKy,
          hocKyPhu: lopHoc.hocKyPhu,
          malhLt: lopHoc.malhLt,
          loai: lopHoc.loai,
          trongsoQt: lopHoc.trongsoQt,
          hinhthucGiangday: lopHoc.hinhthucGiangday,
          tenHocPhan: hocPhan.ten,
        })
        .from(lopHoc)
        .leftJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      if (rows.length > 0) {
        return { items: rows as ClassData[], total: Number(totalRec?.total || 0) };
      }
    } catch {
      // Fallback
    }

    let list = memoryClasses.filter((c) => !c.deletedAt);
    if (filters.semester) list = list.filter((c) => c.hocKy === filters.semester);
    if (filters.courseId) list = list.filter((c) => c.mahp.toUpperCase() === filters.courseId!.toUpperCase());
    if (filters.search) {
      const kw = filters.search.toLowerCase();
      list = list.filter((c) => c.malop.includes(kw) || c.mahp.toLowerCase().includes(kw) || c.tenHocPhan?.toLowerCase().includes(kw));
    }
    return { items: list.slice(offset, offset + limit), total: list.length };
  }

  async findByMalh(malh: number): Promise<ClassData | null> {
    try {
      const [row] = await db
        .select({
          malh: lopHoc.malh,
          mahp: lopHoc.mahp,
          malop: lopHoc.malop,
          hocKy: lopHoc.hocKy,
          hocKyPhu: lopHoc.hocKyPhu,
          malhLt: lopHoc.malhLt,
          loai: lopHoc.loai,
          trongsoQt: lopHoc.trongsoQt,
          hinhthucGiangday: lopHoc.hinhthucGiangday,
          tenHocPhan: hocPhan.ten,
        })
        .from(lopHoc)
        .leftJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(and(eq(lopHoc.malh, malh), isNull(lopHoc.deletedAt)));

      if (row) return row as ClassData;
    } catch {
      // Fallback
    }
    const found = memoryClasses.find((c) => c.malh === malh && !c.deletedAt);
    return found || null;
  }

  async create(data: Omit<ClassData, "malh">): Promise<ClassData> {
    try {
      const [res] = await db.insert(lopHoc).values(data as any).returning();
      if (res) return res as any;
    } catch {
      // Fallback
    }
    const newClass: ClassData = {
      malh: memoryClasses.length + 1,
      ...data,
    };
    memoryClasses.push(newClass);
    return newClass;
  }

  async update(malh: number, data: Partial<ClassData>): Promise<ClassData | null> {
    try {
      const [res] = await db.update(lopHoc).set(data as any).where(eq(lopHoc.malh, malh)).returning();
      if (res) return res as any;
    } catch {
      // Fallback
    }
    const idx = memoryClasses.findIndex((c) => c.malh === malh);
    if (idx !== -1) {
      memoryClasses[idx] = { ...memoryClasses[idx], ...data };
      return memoryClasses[idx];
    }
    return null;
  }

  async softDelete(malh: number): Promise<boolean> {
    try {
      await db.update(lopHoc).set({ deletedAt: new Date() }).where(eq(lopHoc.malh, malh));
      return true;
    } catch {
      // Fallback
    }
    const idx = memoryClasses.findIndex((c) => c.malh === malh);
    if (idx !== -1) {
      memoryClasses[idx].deletedAt = new Date();
      return true;
    }
    return false;
  }

  async getStudentsInClass(malh: number) {
    try {
      const rows = await db
        .select({
          masv: sinhVien.masv,
          hoten: sinhVien.hoten,
          email: sinhVien.email,
          lop: sinhVien.lop,
        })
        .from(svLh)
        .innerJoin(sinhVien, eq(svLh.masv, sinhVien.masv))
        .where(eq(svLh.malh, malh));
      if (rows.length > 0) return rows;
    } catch {
      // Fallback
    }
    const svIds = memorySvLh.filter((x) => x.malh === malh).map((x) => x.masv);
    return [
      { masv: 20210001, hoten: "Nguyễn Văn An", email: "an.nv210001@sis.hust.edu.vn", lop: "K66 - CNPM 01" },
      { masv: 20210002, hoten: "Trần Thị Mai", email: "mai.tt210002@sis.hust.edu.vn", lop: "K66 - CNPM 02" },
    ].filter((s) => svIds.includes(s.masv));
  }

  async addStudentToClass(malh: number, masv: number) {
    try {
      await db.insert(svLh).values({ malh, masv }).onConflictDoNothing();
      return true;
    } catch {
      // Fallback
    }
    if (!memorySvLh.some((x) => x.malh === malh && x.masv === masv)) {
      memorySvLh.push({ malh, masv });
    }
    return true;
  }

  async removeStudentFromClass(malh: number, masv: number) {
    try {
      await db.delete(svLh).where(and(eq(svLh.malh, malh), eq(svLh.masv, masv)));
      return true;
    } catch {
      // Fallback
    }
    memorySvLh = memorySvLh.filter((x) => !(x.malh === malh && x.masv === masv));
    return true;
  }

  async getLecturersInClass(malh: number) {
    try {
      const rows = await db
        .select({
          magv: giangVien.magv,
          hoten: giangVien.hoten,
          email: giangVien.email,
          truong: giangVien.truong,
        })
        .from(gvLh)
        .innerJoin(giangVien, eq(gvLh.magv, giangVien.magv))
        .where(eq(gvLh.malh, malh));
      if (rows.length > 0) return rows;
    } catch {
      // Fallback
    }
    const gvIds = memoryGvLh.filter((x) => x.malh === malh).map((x) => x.magv);
    return [
      { magv: 82, hoten: "TS. Nguyễn Thu Hường", email: "huong.nt@soict.hust.edu.vn", truong: "Bộ môn Công nghệ Phần mềm" },
    ].filter((g) => gvIds.includes(g.magv));
  }

  async addLecturerToClass(malh: number, magv: number) {
    try {
      await db.insert(gvLh).values({ malh, magv }).onConflictDoNothing();
      return true;
    } catch {
      // Fallback
    }
    if (!memoryGvLh.some((x) => x.malh === malh && x.magv === magv)) {
      memoryGvLh.push({ malh, magv });
    }
    return true;
  }

  async removeLecturerFromClass(malh: number, magv: number) {
    try {
      await db.delete(gvLh).where(and(eq(gvLh.malh, malh), eq(gvLh.magv, magv)));
      return true;
    } catch {
      // Fallback
    }
    memoryGvLh = memoryGvLh.filter((x) => !(x.malh === malh && x.magv === magv));
    return true;
  }

  async getTeachingAssistants(malh: number) {
    try {
      const rows = await db
        .select({
          masv: sinhVien.masv,
          hoten: sinhVien.hoten,
          email: sinhVien.email,
        })
        .from(teacherAssistant)
        .innerJoin(sinhVien, eq(teacherAssistant.masv, sinhVien.masv))
        .where(eq(teacherAssistant.malh, malh));
      if (rows.length > 0) return rows;
    } catch {
      // Fallback
    }
    const taIds = memoryTa.filter((x) => x.malh === malh).map((x) => x.masv);
    return [
      { masv: 20210002, hoten: "Trần Thị Mai", email: "mai.tt210002@sis.hust.edu.vn" },
    ].filter((s) => taIds.includes(s.masv));
  }

  async addTeachingAssistant(malh: number, masv: number) {
    try {
      await db.insert(teacherAssistant).values({ malh, masv }).onConflictDoNothing();
      return true;
    } catch {
      // Fallback
    }
    if (!memoryTa.some((x) => x.malh === malh && x.masv === masv)) {
      memoryTa.push({ malh, masv });
    }
    return true;
  }

  async removeTeachingAssistant(malh: number, masv: number) {
    try {
      await db.delete(teacherAssistant).where(and(eq(teacherAssistant.malh, malh), eq(teacherAssistant.masv, masv)));
      return true;
    } catch {
      // Fallback
    }
    memoryTa = memoryTa.filter((x) => !(x.malh === malh && x.masv === masv));
    return true;
  }
}

export const classRepository = new ClassRepository();
