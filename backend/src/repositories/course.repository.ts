import { eq, and, isNull, count, ilike, or, SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { hocPhan } from "../db/schema.js";

export interface CourseData {
  mahp: string;
  ten: string;
  truong?: string | null;
  batBuoc?: boolean | null;
  tinChiDaoTao?: number | null;
  tinChiHocPhi?: number | null;
  phanBo?: string | null;
  noiDung?: string | null;
  deletedAt?: Date | null;
}

let memoryCourses: CourseData[] = [
  { mahp: "IT3040", ten: "Kỹ thuật phần mềm", truong: "Trường CNTT & TT", batBuoc: true, tinChiDaoTao: 3, tinChiHocPhi: 3, phanBo: "3(2-1-0-6)", noiDung: "Agile/Scrum, UML, Software Architecture" },
  { mahp: "IT3080", ten: "Mạng máy tính", truong: "Trường CNTT & TT", batBuoc: true, tinChiDaoTao: 3, tinChiHocPhi: 3, phanBo: "3(2-1-0-6)", noiDung: "OSI, TCP/IP, Routing" },
  { mahp: "IT3100", ten: "Cơ sở dữ liệu", truong: "Trường CNTT & TT", batBuoc: true, tinChiDaoTao: 3, tinChiHocPhi: 3, phanBo: "3(2-1-0-6)", noiDung: "ERD, SQL, Transaction" },
  { mahp: "IT4015", ten: "Kiến trúc hệ thống phần mềm", truong: "Trường CNTT & TT", batBuoc: false, tinChiDaoTao: 3, tinChiHocPhi: 3, phanBo: "3(2-1-0-6)", noiDung: "Microservices, Distributed Systems" },
  { mahp: "MI1110", ten: "Giải tích 1", truong: "Viện Toán ứng dụng & Tin học", batBuoc: true, tinChiDaoTao: 4, tinChiHocPhi: 4, phanBo: "4(3-2-0-8)", noiDung: "Phép tính vi phân và tích phân" },
];

export class CourseRepository {
  async findAll(filters: { search?: string; limit?: number; offset?: number } = {}) {
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    try {
      const conditions: (SQL<unknown> | undefined)[] = [isNull(hocPhan.deletedAt)];
      if (filters.search) {
        const kw = `%${filters.search.trim()}%`;
        conditions.push(or(ilike(hocPhan.mahp, kw), ilike(hocPhan.ten, kw)));
      }

      const validConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined);
      const whereClause = validConditions.length > 0 ? and(...validConditions) : undefined;

      const [totalRec] = await db
        .select({ total: count() })
        .from(hocPhan)
        .where(whereClause);

      const items = await db
        .select()
        .from(hocPhan)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      if (items.length > 0) {
        return { items: items as CourseData[], total: Number(totalRec?.total || 0) };
      }
    } catch {
      // Fallback
    }

    let list = memoryCourses.filter((c) => !c.deletedAt);
    if (filters.search) {
      const kw = filters.search.toLowerCase();
      list = list.filter((c) => c.mahp.toLowerCase().includes(kw) || c.ten.toLowerCase().includes(kw));
    }
    return { items: list.slice(offset, offset + limit), total: list.length };
  }

  async findByMahp(mahp: string): Promise<CourseData | null> {
    try {
      const [res] = await db
        .select()
        .from(hocPhan)
        .where(and(eq(hocPhan.mahp, mahp), isNull(hocPhan.deletedAt)));
      if (res) return res as CourseData;
    } catch {
      // Fallback
    }
    const found = memoryCourses.find((c) => c.mahp.toUpperCase() === mahp.toUpperCase() && !c.deletedAt);
    return found || null;
  }

  async create(data: CourseData): Promise<CourseData> {
    try {
      const [res] = await db.insert(hocPhan).values(data as any).returning();
      if (res) return res as CourseData;
    } catch {
      // Fallback
    }
    memoryCourses.push(data);
    return data;
  }

  async update(mahp: string, data: Partial<CourseData>): Promise<CourseData | null> {
    try {
      const [res] = await db
        .update(hocPhan)
        .set(data as any)
        .where(eq(hocPhan.mahp, mahp))
        .returning();
      if (res) return res as CourseData;
    } catch {
      // Fallback
    }
    const idx = memoryCourses.findIndex((c) => c.mahp.toUpperCase() === mahp.toUpperCase());
    if (idx !== -1) {
      memoryCourses[idx] = { ...memoryCourses[idx], ...data };
      return memoryCourses[idx];
    }
    return null;
  }

  async softDelete(mahp: string): Promise<boolean> {
    try {
      await db.update(hocPhan).set({ deletedAt: new Date() }).where(eq(hocPhan.mahp, mahp));
      return true;
    } catch {
      // Fallback
    }
    const idx = memoryCourses.findIndex((c) => c.mahp.toUpperCase() === mahp.toUpperCase());
    if (idx !== -1) {
      memoryCourses[idx].deletedAt = new Date();
      return true;
    }
    return false;
  }
}

export const courseRepository = new CourseRepository();
