import { accountRepository } from "../repositories/account.repository.js";
import { studentRepository } from "../repositories/student.repository.js";
import { lecturerRepository } from "../repositories/lecturer.repository.js";
import { hashPassword } from "../utils/password.utils.js";

export class AccountService {
  async getMe(matk: number) {
    const account = await accountRepository.findById(matk);
    if (!account) return null;

    let profile = null;
    if (account.role === "SV") {
      profile = await studentRepository.findByMatk(matk);
    } else if (account.role === "GV") {
      profile = await lecturerRepository.findByMatk(matk);
    }

    return {
      matk: account.matk,
      username: account.username,
      role: account.role,
      profile,
      createdAt: account.createdAt,
    };
  }

  async getAccounts(limit = 20, offset = 0) {
    return accountRepository.findAll(limit, offset);
  }

  async getAccountById(matk: number) {
    return accountRepository.findById(matk);
  }

  async createAccount(data: { username: string; password: string; role?: string }) {
    const existing = await accountRepository.findByUsername(data.username);
    if (existing) {
      const err: any = new Error("Tên đăng nhập đã tồn tại");
      err.statusCode = 409;
      throw err;
    }
    const hashed = await hashPassword(data.password);
    return accountRepository.create({
      username: data.username,
      password: hashed,
      role: data.role || "SV",
    });
  }

  async updateAccount(matk: number, data: { username?: string; password?: string; role?: string }) {
    const updates: any = { ...data };
    if (data.password) {
      updates.password = await hashPassword(data.password);
    }
    return accountRepository.update(matk, updates);
  }

  async deleteAccount(matk: number, deletedBy?: number) {
    return accountRepository.softDelete(matk, deletedBy);
  }
}

export const accountService = new AccountService();

