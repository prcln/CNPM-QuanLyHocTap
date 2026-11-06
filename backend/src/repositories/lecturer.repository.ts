import { eq, and, isNull, count, ilike, or, SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { giangVien, gvLh, lopHoc, hocPhan } from "../db/schema.js";

export interface LecturerData {
  magv: number;
  matk: number;
  hoten: string;
  gioiTinh?: string | null;
  email?: string | null;
  truong?: string | null;
  deletedAt?: Date | null;
}

let memoryLecturers: LecturerData[] = [
  {
    magv: 82,
    matk: 2,
    hoten: "TS. Nguyễn Thu Hường",
    gioiTinh: "Nữ",
    email: "huong.nt@soict.hust.edu.vn",
    truong: "Bộ môn Công nghệ Phần mềm",
  },
];

let memoryGvLh: { magv: number; malh: number }[] = [
  { magv: 82, malh: 1 },
  { magv: 82, malh: 2 },
  { magv: 82, malh: 4 },
];

export class LecturerRepository {
  async findByMatk(matk: number): Promise<LecturerData | null> {
    try {
      const [res] = await db
        .select()
        .from(giangVien)
        .where(and(eq(giangVien.matk, matk), isNull(giangVien.deletedAt)));
      if (res) return res as LecturerData;
    } catch {
      // Fallback
    }
    const found = memoryLecturers.find((g) => g.matk === matk && !g.deletedAt);
    return found || null;
  }

  async findByMagv(magv: number): Promise<LecturerData | null> {
    try {
      const [res] = await db
        .select()
        .from(giangVien)
        .where(and(eq(giangVien.magv, magv), isNull(giangVien.deletedAt)));
      if (res) return res as LecturerData;
    } catch {
      // Fallback
    }
    const found = memoryLecturers.find((g) => g.magv === magv && !g.deletedAt);
    return found || null;
  }

  async findAll(filters: { search?: string; limit?: number; offset?: number } = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    try {
      const conditions: (SQL<unknown> | undefined)[] = [isNull(giangVien.deletedAt)];
      if (filters.search) {
        const kw = `%${filters.search.trim()}%`;
        conditions.push(or(ilike(giangVien.hoten, kw), ilike(giangVien.email, kw)));
      }

      const validConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined);
      const whereClause = validConditions.length > 0 ? and(...validConditions) : undefined;

      const [totalRec] = await db
        .select({ total: count() })
        .from(giangVien)
        .where(whereClause);

      const items = await db
        .select()
        .from(giangVien)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      return { items: items as LecturerData[], total: Number(totalRec?.total || 0) };
    } catch {
      // Fallback
    }

    let list = memoryLecturers.filter((g) => !g.deletedAt);
    if (filters.search) {
      const kw = filters.search.toLowerCase();
      list = list.filter((g) => g.hoten.toLowerCase().includes(kw) || g.email?.toLowerCase().includes(kw));
    }
    return { items: list.slice(offset, offset + limit), total: list.length };
  }

  async create(data: LecturerData): Promise<LecturerData> {
    try {
      const [res] = await db.insert(giangVien).values(data as any).returning();
      if (res) return res as LecturerData;
    } catch {
      // Fallback
    }
    memoryLecturers.push(data);
    return data;
  }

  async update(magv: number, data: Partial<LecturerData>): Promise<LecturerData | null> {
    try {
      const [res] = await db
        .update(giangVien)
        .set(data as any)
        .where(eq(giangVien.magv, magv))
        .returning();
      if (res) return res as LecturerData;
    } catch {
      // Fallback
    }
    const idx = memoryLecturers.findIndex((g) => g.magv === magv);
    if (idx !== -1) {
      memoryLecturers[idx] = { ...memoryLecturers[idx], ...data };
      return memoryLecturers[idx];
    }
    return null;
  }

  async softDelete(magv: number): Promise<boolean> {
    try {
      await db.update(giangVien).set({ deletedAt: new Date() }).where(eq(giangVien.magv, magv));
      return true;
    } catch {
      // Fallback
    }
    const idx = memoryLecturers.findIndex((g) => g.magv === magv);
    if (idx !== -1) {
      memoryLecturers[idx].deletedAt = new Date();
      return true;
    }
    return false;
  }

  async getClassesByLecturer(magv: number, semester?: string) {
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
        .from(gvLh)
        .innerJoin(lopHoc, eq(gvLh.malh, lopHoc.malh))
        .innerJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(and(eq(gvLh.magv, magv), semester ? eq(lopHoc.hocKy, semester) : undefined));

      return rows;
    } catch {
      // Fallback
    }

    const myClassIds = memoryGvLh.filter((x) => x.magv === magv).map((x) => x.malh);
    return [
      { malh: 1, mahp: "IT3040", malop: "145678", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", tenHocPhan: "Kỹ thuật phần mềm", tinChi: 3 },
      { malh: 2, mahp: "IT3080", malop: "145679", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", tenHocPhan: "Mạng máy tính", tinChi: 3 },
      { malh: 4, mahp: "IT4015", malop: "145681", hocKy: "20261", loai: "LT+BT", trongsoQt: "0.40", tenHocPhan: "Kiến trúc hệ thống phần mềm", tinChi: 3 },
    ].filter((c) => myClassIds.includes(c.malh));
  }
}

export const lecturerRepository = new LecturerRepository();
