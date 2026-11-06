import { eq, and, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { baiTap, nhom, nhomSv, sinhVien } from "../db/schema.js";

export interface AssignmentItem {
  mabt: number;
  malh: number;
  loai: string | null;
  noiDung: string | null;
  deadline: Date | null;
  deletedAt?: Date | null;
}

export interface GroupItem {
  manhom: number;
  mabt: number;
  deTai: string | null;
  deletedAt?: Date | null;
  members?: { masv: number; hoten: string; email: string | null }[];
}

let memoryAssignments: AssignmentItem[] = [
  { mabt: 1, malh: 1, loai: "Bài tập lớn", noiDung: "Thiết kế kiến trúc hệ thống và xây dựng prototype cho CNPM-QLHT", deadline: new Date(Date.now() + 14 * 86400000) },
  { mabt: 2, malh: 2, loai: "Thực hành mạng", noiDung: "Cấu hình Router Cisco và phân tích gói tin qua Wireshark", deadline: new Date(Date.now() + 7 * 86400000) },
];

let memoryGroups: GroupItem[] = [
  { manhom: 1, mabt: 1, deTai: "Nhóm 01: Hệ thống Quản lý Học tập sinh viên ĐHBK Hà Nội" },
];

let memoryNhomSv: { manhom: number; masv: number }[] = [
  { manhom: 1, masv: 20210001 },
  { manhom: 1, masv: 20210002 },
];

export class AssignmentRepository {
  async getAssignmentsByClass(malh: number): Promise<AssignmentItem[]> {
    try {
      const rows = await db
        .select()
        .from(baiTap)
        .where(and(eq(baiTap.malh, malh), isNull(baiTap.deletedAt)));
      if (rows.length > 0) return rows as AssignmentItem[];
    } catch {
      // Fallback
    }

    return memoryAssignments.filter((a) => a.malh === malh && !a.deletedAt);
  }

  async findById(mabt: number): Promise<AssignmentItem | null> {
    try {
      const [row] = await db
        .select()
        .from(baiTap)
        .where(and(eq(baiTap.mabt, mabt), isNull(baiTap.deletedAt)));
      if (row) return row as AssignmentItem;
    } catch {
      // Fallback
    }

    return memoryAssignments.find((a) => a.mabt === mabt && !a.deletedAt) || null;
  }

  async create(data: { malh: number; loai?: string; noiDung?: string; deadline?: Date }): Promise<AssignmentItem> {
    try {
      const [res] = await db.insert(baiTap).values(data as any).returning();
      if (res) return res as AssignmentItem;
    } catch {
      // Fallback
    }

    const newAssignment: AssignmentItem = {
      mabt: memoryAssignments.length + 1,
      malh: data.malh,
      loai: data.loai || "Bài tập lớn",
      noiDung: data.noiDung || "",
      deadline: data.deadline || null,
    };
    memoryAssignments.push(newAssignment);
    return newAssignment;
  }

  async update(mabt: number, data: Partial<AssignmentItem>): Promise<AssignmentItem | null> {
    try {
      const [res] = await db.update(baiTap).set(data as any).where(eq(baiTap.mabt, mabt)).returning();
      if (res) return res as AssignmentItem;
    } catch {
      // Fallback
    }

    const idx = memoryAssignments.findIndex((a) => a.mabt === mabt);
    if (idx !== -1) {
      memoryAssignments[idx] = { ...memoryAssignments[idx], ...data };
      return memoryAssignments[idx];
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

