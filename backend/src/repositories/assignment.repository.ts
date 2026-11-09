import { eq, and, isNull, or, ilike, SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { baiTap, nhom, nhomSv, sinhVien, lopHoc, hocPhan } from "../db/schema.js";

export interface AssignmentItem {
  mabt: number;
  malh: number;
  loai: string | null;
  noiDung: string | null;
  deadline: Date | null;
  deletedAt?: Date | null;
  title?: string | null;
  description?: string | null;
  dueDate?: Date | null;
  courseId?: string | number;
  tenHocPhan?: string | null;
  malop?: string | null;
  status?: string;
}

const assignmentStatusMap: Map<number, string> = new Map();

export interface GroupItem {
  manhom: number;
  mabt: number;
  deTai: string | null;
  deletedAt?: Date | null;
  members?: { masv: number; hoten: string; email: string | null }[];
}

let memoryAssignments: AssignmentItem[] = [
  {
    mabt: 1,
    malh: 1,
    loai: "Bài tập lớn",
    noiDung: "Thiết kế kiến trúc hệ thống và xây dựng prototype cho CNPM-QLHT",
    deadline: new Date(Date.now() + 14 * 86400000),
    title: "Bài tập lớn",
    description: "Thiết kế kiến trúc hệ thống và xây dựng prototype cho CNPM-QLHT",
    courseId: 1,
    malop: "145678",
    tenHocPhan: "Kỹ thuật phần mềm",
  },
  {
    mabt: 2,
    malh: 2,
    loai: "Thực hành mạng",
    noiDung: "Cấu hình Router Cisco và phân tích gói tin qua Wireshark",
    deadline: new Date(Date.now() + 7 * 86400000),
    title: "Thực hành mạng",
    description: "Cấu hình Router Cisco và phân tích gói tin qua Wireshark",
    courseId: 2,
    malop: "145679",
    tenHocPhan: "Mạng máy tính",
  },
  {
    mabt: 3,
    malh: 1,
    loai: "Báo cáo tiến độ Sprint 1",
    noiDung: "Hoàn thiện SRS và tài liệu API Contract đồng bộ theo chuẩn RESTful",
    deadline: new Date(Date.now() + 4 * 86400000),
    title: "Báo cáo tiến độ Sprint 1",
    description: "Hoàn thiện SRS và tài liệu API Contract đồng bộ theo chuẩn RESTful",
    courseId: 1,
    malop: "145678",
    tenHocPhan: "Kỹ thuật phần mềm",
  },
  {
    mabt: 4,
    malh: 3,
    loai: "Bài tập SQL nâng cao",
    noiDung: "Tối ưu hóa truy vấn CSDL với chỉ mục Indexing và phân vùng Partitioning",
    deadline: new Date(Date.now() + 10 * 86400000),
    title: "Bài tập SQL nâng cao",
    description: "Tối ưu hóa truy vấn CSDL với chỉ mục Indexing và phân vùng Partitioning",
    courseId: 3,
    malop: "145680",
    tenHocPhan: "Cơ sở dữ liệu",
  },
];

let memoryGroups: GroupItem[] = [
  { manhom: 1, mabt: 1, deTai: "Nhóm 01: Hệ thống Quản lý Học tập sinh viên ĐHBK Hà Nội" },
];

let memoryNhomSv: { manhom: number; masv: number }[] = [
  { manhom: 1, masv: 20210001 },
  { manhom: 1, masv: 20210002 },
];

export class AssignmentRepository {
  async getAll(filters?: { malh?: number; search?: string }): Promise<AssignmentItem[]> {
    try {
      const conditions: (SQL<unknown> | undefined)[] = [isNull(baiTap.deletedAt)];
      if (filters?.malh) {
        conditions.push(eq(baiTap.malh, filters.malh));
      }
      if (filters?.search) {
        const kw = `%${filters.search.trim()}%`;
        conditions.push(or(ilike(baiTap.loai, kw), ilike(baiTap.noiDung, kw)));
      }
      const validConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined);
      const whereClause = validConditions.length > 0 ? and(...validConditions) : undefined;

      const rows = await db
        .select({
          mabt: baiTap.mabt,
          malh: baiTap.malh,
          loai: baiTap.loai,
          noiDung: baiTap.noiDung,
          deadline: baiTap.deadline,
          deletedAt: baiTap.deletedAt,
          malop: lopHoc.malop,
          tenHocPhan: hocPhan.ten,
        })
        .from(baiTap)
        .leftJoin(lopHoc, eq(baiTap.malh, lopHoc.malh))
        .leftJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(whereClause);

      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          ...r,
          title: r.loai,
          description: r.noiDung,
          dueDate: r.deadline,
          courseId: r.malh,
          status: assignmentStatusMap.get(r.mabt) || "pending",
        })) as AssignmentItem[];
      }
    } catch {
      // Fallback
    }

    let result = memoryAssignments.filter((a) => !a.deletedAt);
    if (filters?.malh) {
      result = result.filter((a) => a.malh === filters.malh);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          (a.loai && a.loai.toLowerCase().includes(q)) ||
          (a.noiDung && a.noiDung.toLowerCase().includes(q))
      );
    }
    return result.map((r) => ({
      ...r,
      title: r.title || r.loai,
      description: r.description || r.noiDung,
      dueDate: r.dueDate || r.deadline,
      courseId: r.courseId || r.malh,
      status: assignmentStatusMap.get(r.mabt) || r.status || "pending",
    }));
  }

  async getAssignmentsByClass(malh: number): Promise<AssignmentItem[]> {
    return this.getAll({ malh });
  }

  async findById(mabt: number): Promise<AssignmentItem | null> {
    try {
      const [row] = await db
        .select({
          mabt: baiTap.mabt,
          malh: baiTap.malh,
          loai: baiTap.loai,
          noiDung: baiTap.noiDung,
          deadline: baiTap.deadline,
          deletedAt: baiTap.deletedAt,
          malop: lopHoc.malop,
          tenHocPhan: hocPhan.ten,
        })
        .from(baiTap)
        .leftJoin(lopHoc, eq(baiTap.malh, lopHoc.malh))
        .leftJoin(hocPhan, eq(lopHoc.mahp, hocPhan.mahp))
        .where(and(eq(baiTap.mabt, mabt), isNull(baiTap.deletedAt)));
      if (row) {
        return {
          ...row,
          title: row.loai,
          description: row.noiDung,
          dueDate: row.deadline,
          courseId: row.malh,
        } as AssignmentItem;
      }
    } catch {
      // Fallback
    }

    const item = memoryAssignments.find((a) => a.mabt === mabt && !a.deletedAt);
    if (!item) return null;
    return {
      ...item,
      title: item.title || item.loai,
      description: item.description || item.noiDung,
      dueDate: item.dueDate || item.deadline,
      courseId: item.courseId || item.malh,
    };
  }

  async create(data: { malh?: number; loai?: string; noiDung?: string; deadline?: Date }): Promise<AssignmentItem> {
    const finalMalh = data.malh && !isNaN(data.malh) ? data.malh : 1;
    const insertPayload = {
      malh: finalMalh,
      loai: data.loai || "Bài tập lớn",
      noiDung: data.noiDung || "",
      deadline: data.deadline || null,
    };
    try {
      const [res] = await db.insert(baiTap).values(insertPayload as any).returning();
      if (res) {
        return {
          ...res,
          title: res.loai,
          description: res.noiDung,
          dueDate: res.deadline,
          courseId: res.malh,
        } as AssignmentItem;
      }
    } catch {
      // Fallback
    }

    const newAssignment: AssignmentItem = {
      mabt: memoryAssignments.length + 1,
      ...insertPayload,
      title: insertPayload.loai,
      description: insertPayload.noiDung,
      dueDate: insertPayload.deadline,
      courseId: insertPayload.malh,
    };
    memoryAssignments.push(newAssignment);
    return newAssignment;
  }

  async update(mabt: number, data: Partial<AssignmentItem>): Promise<AssignmentItem | null> {
    const updatePayload: any = {};
    if (data.loai !== undefined) updatePayload.loai = data.loai;
    if (data.noiDung !== undefined) updatePayload.noiDung = data.noiDung;
    if (data.deadline !== undefined) updatePayload.deadline = data.deadline;
    if (data.malh !== undefined) updatePayload.malh = data.malh;

    try {
      const [res] = await db
        .update(baiTap)
        .set(updatePayload)
        .where(eq(baiTap.mabt, mabt))
        .returning();
      if (res) {
        return {
          ...res,
          title: res.loai,
          description: res.noiDung,
          dueDate: res.deadline,
          courseId: res.malh,
        } as AssignmentItem;
      }
    } catch {
      // Fallback
    }

    const idx = memoryAssignments.findIndex((a) => a.mabt === mabt);
    if (idx !== -1) {
      memoryAssignments[idx] = { ...memoryAssignments[idx], ...data, ...updatePayload };
      return {
        ...memoryAssignments[idx],
        title: memoryAssignments[idx].title || memoryAssignments[idx].loai,
        description: memoryAssignments[idx].description || memoryAssignments[idx].noiDung,
        dueDate: memoryAssignments[idx].dueDate || memoryAssignments[idx].deadline,
        courseId: memoryAssignments[idx].courseId || memoryAssignments[idx].malh,
      };
    }
    return null;
  }

  async delete(mabt: number): Promise<boolean> {
    try {
      await db.update(baiTap).set({ deletedAt: new Date() }).where(eq(baiTap.mabt, mabt));
      return true;
    } catch {
      // Fallback
    }

    const idx = memoryAssignments.findIndex((a) => a.mabt === mabt);
    if (idx !== -1) {
      memoryAssignments[idx].deletedAt = new Date();
      return true;
    }
    return false;
  }

  async toggleStatus(mabt: number): Promise<AssignmentItem | null> {
    const item = await this.findById(mabt);
    if (!item) return null;
    const current = assignmentStatusMap.get(mabt) || (item as any).status || "pending";
    const next = current === "completed" ? "pending" : "completed";
    assignmentStatusMap.set(mabt, next);
    return {
      ...item,
      status: next,
    };
  }

  async getGroupsByAssignment(mabt: number): Promise<GroupItem[]> {
    try {
      const rows = await db
        .select()
        .from(nhom)
        .where(and(eq(nhom.mabt, mabt), isNull(nhom.deletedAt)));
      if (rows.length > 0) return rows as GroupItem[];
    } catch {
      // Fallback
    }

    return memoryGroups.filter((g) => g.mabt === mabt && !g.deletedAt);
  }

  async getGroupById(manhom: number): Promise<GroupItem | null> {
    try {
      const [row] = await db
        .select()
        .from(nhom)
        .where(and(eq(nhom.manhom, manhom), isNull(nhom.deletedAt)));
      if (row) return row as GroupItem;
    } catch {
      // Fallback
    }

    return memoryGroups.find((g) => g.manhom === manhom && !g.deletedAt) || null;
  }

  async createGroup(data: { mabt: number; deTai?: string }): Promise<GroupItem> {
    try {
      const [res] = await db.insert(nhom).values(data as any).returning();
      if (res) return res as GroupItem;
    } catch {
      // Fallback
    }

    const newGroup: GroupItem = {
      manhom: memoryGroups.length + 1,
      mabt: data.mabt,
      deTai: data.deTai || "",
    };
    memoryGroups.push(newGroup);
    return newGroup;
  }

  async updateGroup(manhom: number, data: { deTai?: string }): Promise<GroupItem | null> {
    try {
      const [res] = await db.update(nhom).set(data as any).where(eq(nhom.manhom, manhom)).returning();
      if (res) return res as GroupItem;
    } catch {
      // Fallback
    }

    const idx = memoryGroups.findIndex((g) => g.manhom === manhom);
    if (idx !== -1) {
      memoryGroups[idx] = { ...memoryGroups[idx], ...data };
      return memoryGroups[idx];
    }
    return null;
  }

  async deleteGroup(manhom: number): Promise<boolean> {
    try {
      await db.update(nhom).set({ deletedAt: new Date() }).where(eq(nhom.manhom, manhom));
      return true;
    } catch {
      // Fallback
    }

    const idx = memoryGroups.findIndex((g) => g.manhom === manhom);
    if (idx !== -1) {
      memoryGroups[idx].deletedAt = new Date();
      return true;
    }
    return false;
  }

  async getGroupMembers(manhom: number) {
    try {
      const rows = await db
        .select({
          masv: sinhVien.masv,
          hoten: sinhVien.hoten,
          email: sinhVien.email,
          lop: sinhVien.lop,
        })
        .from(nhomSv)
        .innerJoin(sinhVien, eq(nhomSv.masv, sinhVien.masv))
        .where(eq(nhomSv.manhom, manhom));
      if (rows.length > 0) return rows;
    } catch {
      // Fallback
    }

    const svIds = memoryNhomSv.filter((x) => x.manhom === manhom).map((x) => x.masv);
    return [
      { masv: 20210001, hoten: "Nguyễn Văn An", email: "an.nv210001@sis.hust.edu.vn", lop: "K66 - CNPM 01" },
      { masv: 20210002, hoten: "Trần Thị Mai", email: "mai.tt210002@sis.hust.edu.vn", lop: "K66 - CNPM 02" },
    ].filter((s) => svIds.includes(s.masv));
  }

  async addMemberToGroup(manhom: number, masv: number): Promise<boolean> {
    try {
      await db.insert(nhomSv).values({ manhom, masv }).onConflictDoNothing();
      return true;
    } catch {
      // Fallback
    }

    if (!memoryNhomSv.some((x) => x.manhom === manhom && x.masv === masv)) {
      memoryNhomSv.push({ manhom, masv });
    }
    return true;
  }

  async removeMemberFromGroup(manhom: number, masv: number): Promise<boolean> {
    try {
      await db.delete(nhomSv).where(and(eq(nhomSv.manhom, manhom), eq(nhomSv.masv, masv)));
      return true;
    } catch {
      // Fallback
    }

    memoryNhomSv = memoryNhomSv.filter((x) => !(x.manhom === manhom && x.masv === masv));
    return true;
  }
}

export const assignmentRepository = new AssignmentRepository();

