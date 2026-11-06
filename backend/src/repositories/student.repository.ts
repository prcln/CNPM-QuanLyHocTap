import { eq, and, isNull, count, ilike, or, SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { sinhVien, svLh, lopHoc, hocPhan, dangKyLop } from "../db/schema.js";

export interface StudentData {
  masv: number;
  matk: number;
  hoten: string;
  gioiTinh?: string | null;
  email?: string | null;
  chuong_trinh?: string | null;
  truong?: string | null;
  lop?: string | null;
  khoa?: number | null;
  trangThai?: string | null;
  cpa?: string | null;
  deletedAt?: Date | null;
}

// In-memory fallback
let memoryStudents: StudentData[] = [
  {
    masv: 20210001,
    matk: 3,
    hoten: "Nguyễn Văn An",
    gioiTinh: "Nam",
    email: "an.nv210001@sis.hust.edu.vn",
    chuong_trinh: "CNPM",
    truong: "Trường CNTT & TT",
    lop: "K66 - CNPM 01",
    khoa: 66,
    trangThai: "Học",
    cpa: "3.42",
  },
  {
    masv: 20210002,
    matk: 4,
    hoten: "Trần Thị Mai",
    gioiTinh: "Nữ",
    email: "mai.tt210002@sis.hust.edu.vn",
    chuong_trinh: "CNPM",
    truong: "Trường CNTT & TT",
    lop: "K66 - CNPM 02",
    khoa: 66,
    trangThai: "Học",
    cpa: "3.65",
  },
];

let memorySvLh: { masv: number; malh: number }[] = [
  { masv: 20210001, malh: 1 },
  { masv: 20210001, malh: 2 },
  { masv: 20210001, malh: 3 },
  { masv: 20210002, malh: 1 },
  { masv: 20210002, malh: 4 },
];

export class StudentRepository {
  async findByMatk(matk: number): Promise<StudentData | null> {
    try {
      const [res] = await db
        .select()
        .from(sinhVien)
        .where(and(eq(sinhVien.matk, matk), isNull(sinhVien.deletedAt)));
      if (res) return res as StudentData;
    } catch {
      // Fallback
    }
    const found = memoryStudents.find((s) => s.matk === matk && !s.deletedAt);
    return found || null;
  }

  async findByMasv(masv: number): Promise<StudentData | null> {
    try {
      const [res] = await db
        .select()
        .from(sinhVien)
        .where(and(eq(sinhVien.masv, masv), isNull(sinhVien.deletedAt)));
      if (res) return res as StudentData;
    } catch {
      // Fallback
    }
    const found = memoryStudents.find((s) => s.masv === masv && !s.deletedAt);
    return found || null;
  }

  async findAll(filters: { search?: string; khoa?: number; lop?: string; limit?: number; offset?: number } = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    try {
      const conditions: (SQL<unknown> | undefined)[] = [isNull(sinhVien.deletedAt)];
      if (filters.khoa) conditions.push(eq(sinhVien.khoa, filters.khoa));
      if (filters.lop) conditions.push(eq(sinhVien.lop, filters.lop));
      if (filters.search) {
        const kw = `%${filters.search.trim()}%`;
        conditions.push(or(ilike(sinhVien.hoten, kw), ilike(sinhVien.email, kw)));
      }

      const validConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined);
      const whereClause = validConditions.length > 0 ? and(...validConditions) : undefined;

      const [totalRec] = await db
        .select({ total: count() })
        .from(sinhVien)
        .where(whereClause);

      const items = await db
        .select()
        .from(sinhVien)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      return { items: items as StudentData[], total: Number(totalRec?.total || 0) };
    } catch {
      // Fallback
    }

    let list = memoryStudents.filter((s) => !s.deletedAt);
    if (filters.khoa) list = list.filter((s) => s.khoa === filters.khoa);
    if (filters.lop) list = list.filter((s) => s.lop === filters.lop);
    if (filters.search) {
      const kw = filters.search.toLowerCase();
      list = list.filter((s) => s.hoten.toLowerCase().includes(kw) || s.email?.toLowerCase().includes(kw));
    }
    return { items: list.slice(offset, offset + limit), total: list.length };
  }

  async create(data: StudentData): Promise<StudentData> {
    try {
      const [res] = await db.insert(sinhVien).values(data as any).returning();
      if (res) return res as StudentData;
    } catch {
      // Fallback
    }
    memoryStudents.push(data);
    return data;
  }

  async update(masv: number, data: Partial<StudentData>): Promise<StudentData | null> {
    try {
      const [res] = await db
        .update(sinhVien)
        .set(data as any)
        .where(eq(sinhVien.masv, masv))
        .returning();
      if (res) return res as StudentData;
    } catch {
      // Fallback
    }
    const idx = memoryStudents.findIndex((s) => s.masv === masv);
    if (idx !== -1) {
      memoryStudents[idx] = { ...memoryStudents[idx], ...data };
      return memoryStudents[idx];
    }
    return null;
  }

  async softDelete(masv: number): Promise<boolean> {
    try {
      await db.update(sinhVien).set({ deletedAt: new Date() }).where(eq(sinhVien.masv, masv));
      return true;
    } catch {
      // Fallback
    }
    const idx = memoryStudents.findIndex((s) => s.masv === masv);
    if (idx !== -1) {
      memoryStudents[idx].deletedAt = new Date();
      return true;
    }
    return false;
  }

  async getClassesByStudent(masv: number, semester?: string) {
    try {
      const rows = await db
        .select({
          malh: lopHoc.malh,
          mahp: lopHoc.mahp,
          malop: lopHoc.malop,
          hocKy: lopHoc.hocKy,
          loai: lopHoc.loai,
          trongsoQt: lopHoc.trongsoQt,
          tenHocPhan: hocPhan.ten,
          tinChi: hocPhan.tinChiDaoTao,
        })
        .from(svLh)
        .innerJoin(lopHoc, eq(svLh.malh, lopHoc.malh))
        .innerJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(and(eq(svLh.masv, masv), semester ? eq(lopHoc.hocKy, semester) : undefined));

      return rows;
    } catch {
      // Fallback
    }

    const myClassIds = memorySvLh.filter((x) => x.masv === masv).map((x) => x.malh);
    return [
      { malh: 1, mahp: "IT3040", malop: "145678", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", tenHocPhan: "Kỹ thuật phần mềm", tinChi: 3 },
      { malh: 2, mahp: "IT3080", malop: "145679", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", tenHocPhan: "Mạng máy tính", tinChi: 3 },
      { malh: 3, mahp: "IT3100", malop: "145680", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.30", tenHocPhan: "Cơ sở dữ liệu", tinChi: 3 },
    ].filter((c) => myClassIds.includes(c.malh));
  }

  async registerClass(masv: number, malh: number) {
    try {
      await db.insert(svLh).values({ masv, malh }).onConflictDoNothing();
      await db.insert(dangKyLop).values({ masv, malh, trangThai: "DangHoc" }).onConflictDoNothing();
      return true;
    } catch {
      // Fallback
    }
    if (!memorySvLh.some((x) => x.masv === masv && x.malh === malh)) {
      memorySvLh.push({ masv, malh });
    }
    return true;
  }

  async unregisterClass(masv: number, malh: number) {
    try {
      await db.delete(svLh).where(and(eq(svLh.masv, masv), eq(svLh.malh, malh)));
      await db.update(dangKyLop).set({ trangThai: "DaHuy" }).where(and(eq(dangKyLop.masv, masv), eq(dangKyLop.malh, malh)));
      return true;
    } catch {
      // Fallback
    }
    memorySvLh = memorySvLh.filter((x) => !(x.masv === masv && x.malh === malh));
    return true;
  }
}

export const studentRepository = new StudentRepository();
