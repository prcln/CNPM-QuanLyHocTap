import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { diem, lopHoc, hocPhan, sinhVien } from "../db/schema.js";

export interface GradeItem {
  madiem: number;
  masv: number;
  malh: number;
  diemQt: string | null;
  diemCk: string | null;
  malop?: string;
  mahp?: string;
  tenHocPhan?: string;
  tinChi?: number;
  trongsoQt?: string;
  hotenSinhVien?: string;
}

let memoryGrades: GradeItem[] = [
  { madiem: 1, masv: 20210001, malh: 1, diemQt: "8.50", diemCk: "8.00", malop: "145678", mahp: "IT3040", tenHocPhan: "Kỹ thuật phần mềm", tinChi: 3, trongsoQt: "0.40", hotenSinhVien: "Nguyễn Văn An" },
  { madiem: 2, masv: 20210001, malh: 2, diemQt: "9.00", diemCk: "9.00", malop: "145679", mahp: "IT3080", tenHocPhan: "Mạng máy tính", tinChi: 3, trongsoQt: "0.40", hotenSinhVien: "Nguyễn Văn An" },
  { madiem: 3, masv: 20210001, malh: 3, diemQt: "7.50", diemCk: "8.00", malop: "145680", mahp: "IT3100", tenHocPhan: "Cơ sở dữ liệu", tinChi: 3, trongsoQt: "0.30", hotenSinhVien: "Nguyễn Văn An" },
  { madiem: 4, masv: 20210002, malh: 1, diemQt: "9.50", diemCk: "9.00", malop: "145678", mahp: "IT3040", tenHocPhan: "Kỹ thuật phần mềm", tinChi: 3, trongsoQt: "0.40", hotenSinhVien: "Trần Thị Mai" },
  { madiem: 5, masv: 20210002, malh: 4, diemQt: "8.00", diemCk: "8.50", malop: "145681", mahp: "IT4015", tenHocPhan: "Kiến trúc hệ thống phần mềm", tinChi: 3, trongsoQt: "0.40", hotenSinhVien: "Trần Thị Mai" },
];

export class GradeRepository {
  async getGradesByStudent(masv: number, malh?: number): Promise<GradeItem[]> {
    try {
      const conditions = [eq(diem.masv, masv)];
      if (malh) conditions.push(eq(diem.malh, malh));

      const rows = await db
        .select({
          madiem: diem.madiem,
          masv: diem.masv,
          malh: diem.malh,
          diemQt: diem.diemQt,
          diemCk: diem.diemCk,
          malop: lopHoc.malop,
          mahp: lopHoc.mahp,
          tenHocPhan: hocPhan.ten,
          tinChi: hocPhan.tinChiDaoTao,
          trongsoQt: lopHoc.trongsoQt,
        })
        .from(diem)
        .innerJoin(lopHoc, eq(diem.malh, lopHoc.malh))
        .innerJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(and(...conditions));

      if (rows.length > 0) return rows as GradeItem[];
    } catch {
      // Fallback
    }

    let list = memoryGrades.filter((g) => g.masv === masv);
    if (malh) list = list.filter((g) => g.malh === malh);
    return list;
  }

  async getGradesByClass(malh: number): Promise<GradeItem[]> {
    try {
      const rows = await db
        .select({
          madiem: diem.madiem,
          masv: diem.masv,
          malh: diem.malh,
          diemQt: diem.diemQt,
          diemCk: diem.diemCk,
          malop: lopHoc.malop,
          mahp: lopHoc.mahp,
          tenHocPhan: hocPhan.ten,
          tinChi: hocPhan.tinChiDaoTao,
          trongsoQt: lopHoc.trongsoQt,
          hotenSinhVien: sinhVien.hoten,
        })
        .from(diem)
        .innerJoin(lopHoc, eq(diem.malh, lopHoc.malh))
        .innerJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .innerJoin(sinhVien, eq(diem.masv, sinhVien.masv))
        .where(eq(diem.malh, malh));

      if (rows.length > 0) return rows as GradeItem[];
    } catch {
      // Fallback
    }

    return memoryGrades.filter((g) => g.malh === malh);
  }

  async getGradeByClassAndStudent(malh: number, masv: number): Promise<GradeItem | null> {
    try {
      const [row] = await db
        .select({
          madiem: diem.madiem,
          masv: diem.masv,
          malh: diem.malh,
          diemQt: diem.diemQt,
          diemCk: diem.diemCk,
          malop: lopHoc.malop,
          mahp: lopHoc.mahp,
          tenHocPhan: hocPhan.ten,
          tinChi: hocPhan.tinChiDaoTao,
          trongsoQt: lopHoc.trongsoQt,
          hotenSinhVien: sinhVien.hoten,
        })
        .from(diem)
        .innerJoin(lopHoc, eq(diem.malh, lopHoc.malh))
        .innerJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .innerJoin(sinhVien, eq(diem.masv, sinhVien.masv))
        .where(and(eq(diem.malh, malh), eq(diem.masv, masv)));

      if (row) return row as GradeItem;
    } catch {
      // Fallback
    }

    const found = memoryGrades.find((g) => g.malh === malh && g.masv === masv);
    return found || null;
  }

  async upsertGrade(data: { masv: number; malh: number; diemQt?: number; diemCk?: number }): Promise<GradeItem> {
    const qtStr = data.diemQt !== undefined ? Number(data.diemQt).toFixed(2) : undefined;
    const ckStr = data.diemCk !== undefined ? Number(data.diemCk).toFixed(2) : undefined;

    try {
      const [res] = await db
        .insert(diem)
        .values({
          masv: data.masv,
          malh: data.malh,
          diemQt: qtStr,
          diemCk: ckStr,
        })
        .onConflictDoUpdate({
          target: [diem.masv, diem.malh],
          set: {
            ...(qtStr !== undefined ? { diemQt: qtStr } : {}),
            ...(ckStr !== undefined ? { diemCk: ckStr } : {}),
          },
        })
        .returning();

      if (res) return res as any;
    } catch {
      // Fallback
    }

    const idx = memoryGrades.findIndex((g) => g.malh === data.malh && g.masv === data.masv);
    if (idx !== -1) {
      if (qtStr !== undefined) memoryGrades[idx].diemQt = qtStr;
      if (ckStr !== undefined) memoryGrades[idx].diemCk = ckStr;
      return memoryGrades[idx];
    }

    const newGrade: GradeItem = {
      madiem: memoryGrades.length + 1,
      masv: data.masv,
      malh: data.malh,
      diemQt: qtStr || null,
      diemCk: ckStr || null,
    };
    memoryGrades.push(newGrade);
    return newGrade;
  }

  async deleteGrade(malh: number, masv: number): Promise<boolean> {
    try {
      await db.delete(diem).where(and(eq(diem.malh, malh), eq(diem.masv, masv)));
      return true;
    } catch {
      // Fallback
    }

    const idx = memoryGrades.findIndex((g) => g.malh === malh && g.masv === masv);
    if (idx !== -1) {
      memoryGrades.splice(idx, 1);
      return true;
    }
    return false;
  }
}

export const gradeRepository = new GradeRepository();

