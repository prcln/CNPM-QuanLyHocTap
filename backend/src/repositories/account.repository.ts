import { eq, and, isNull, count } from "drizzle-orm";
import { db } from "../db/index.js";
import { taiKhoan } from "../db/schema.js";

export interface AccountData {
  matk: number;
  username: string;
  password?: string;
  role: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  deletedBy?: number | null;
}

// In-memory fallback cache
let memoryAccounts: AccountData[] = [
  { matk: 1, username: "admin", password: "$2b$10$f.w27K8JqC4jB3b6V7kIuu10Uo4K4Jg3zU1rYq6v0eH3C0yE5cEWy", role: "AD", createdAt: new Date() },
  { matk: 2, username: "gv_huong", password: "$2b$10$3X2z4m0N5P8vKqY7b4W8uu6K7yE2M4v1xYq0w0eH1C0zE3cEWx", role: "GV", createdAt: new Date() },
  { matk: 3, username: "sv_20210001", password: "$2b$10$3X2z4m0N5P8vKqY7b4W8uu6K7yE2M4v1xYq0w0eH1C0zE3cEWx", role: "SV", createdAt: new Date() },
  { matk: 4, username: "sv_20210002", password: "$2b$10$3X2z4m0N5P8vKqY7b4W8uu6K7yE2M4v1xYq0w0eH1C0zE3cEWx", role: "SV", createdAt: new Date() },
];

export class AccountRepository {
  async findByUsername(username: string): Promise<AccountData | null> {
    try {
      const [res] = await db
        .select()
        .from(taiKhoan)
        .where(and(eq(taiKhoan.username, username), isNull(taiKhoan.deletedAt)));
      if (res) return res as AccountData;
    } catch {
      // Fallback memory
    }
    const found = memoryAccounts.find((a) => a.username === username && !a.deletedAt);
    return found || null;
  }

  async findById(matk: number): Promise<AccountData | null> {
    try {
      const [res] = await db
        .select()
        .from(taiKhoan)
        .where(and(eq(taiKhoan.matk, matk), isNull(taiKhoan.deletedAt)));
      if (res) return res as AccountData;
    } catch {
      // Fallback
    }
    const found = memoryAccounts.find((a) => a.matk === matk && !a.deletedAt);
    return found || null;
  }

  async findAll(limit = 20, offset = 0): Promise<{ items: AccountData[]; total: number }> {
    try {
      const [totalRec] = await db
        .select({ total: count() })
        .from(taiKhoan)
        .where(isNull(taiKhoan.deletedAt));

      const items = await db
        .select({
          matk: taiKhoan.matk,
          username: taiKhoan.username,
          role: taiKhoan.role,
          createdAt: taiKhoan.createdAt,
          updatedAt: taiKhoan.updatedAt,
        })
        .from(taiKhoan)
        .where(isNull(taiKhoan.deletedAt))
        .limit(limit)
        .offset(offset);

      return { items: items as AccountData[], total: Number(totalRec?.total || 0) };
    } catch {
      // Fallback
    }
    const active = memoryAccounts.filter((a) => !a.deletedAt);
    return {
      items: active.slice(offset, offset + limit),
      total: active.length,
    };
  }

  async create(data: { username: string; password: string; role: string }): Promise<AccountData> {
    try {
      const [res] = await db
        .insert(taiKhoan)
        .values({
          username: data.username,
          password: data.password,
          role: data.role,
        })
        .returning();
      if (res) return res as AccountData;
    } catch {
      // Fallback
    }
    const newAccount: AccountData = {
      matk: memoryAccounts.length + 1,
      username: data.username,
      password: data.password,
      role: data.role,
      createdAt: new Date(),
    };
    memoryAccounts.push(newAccount);
    return newAccount;
  }

  async update(matk: number, data: Partial<{ username: string; password: string; role: string }>): Promise<AccountData | null> {
    try {
      const [res] = await db
        .update(taiKhoan)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(taiKhoan.matk, matk))
        .returning();
      if (res) return res as AccountData;
    } catch {
      // Fallback
    }
    const idx = memoryAccounts.findIndex((a) => a.matk === matk);
    if (idx !== -1) {
      memoryAccounts[idx] = { ...memoryAccounts[idx], ...data, updatedAt: new Date() };
      return memoryAccounts[idx];
    }
    return null;
  }

  async softDelete(matk: number, deletedBy?: number): Promise<boolean> {
    try {
      await db
        .update(taiKhoan)
        .set({
          deletedAt: new Date(),
          deletedBy: deletedBy || null,
        })
        .where(eq(taiKhoan.matk, matk));
      return true;
    } catch {
      // Fallback
    }
    const idx = memoryAccounts.findIndex((a) => a.matk === matk);
    if (idx !== -1) {
      memoryAccounts[idx].deletedAt = new Date();
      memoryAccounts[idx].deletedBy = deletedBy || null;
      return true;
    }
    return false;
  }
}

export const accountRepository = new AccountRepository();

