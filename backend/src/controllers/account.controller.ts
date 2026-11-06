import { Request, Response } from "express";
import { accountService } from "../services/account.service.js";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class AccountController {
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.matk) {
        sendError(res, 401, "Chưa xác thực người dùng");
        return;
      }
      const data = await accountService.getMe(req.user.matk);
      if (!data) {
        sendError(res, 404, "Không tìm thấy tài khoản");
        return;
      }
      sendSuccess(res, data, "Lấy thông tin tài khoản thành công");
    } catch (err: any) {
      sendError(res, 500, err.message || "Lỗi máy chủ", err.details);
    }
  }

  async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const data = await accountService.getAccounts(limit, offset);
      sendSuccess(res, data.items, "Lấy danh sách tài khoản thành công", 200, {
        total: data.total,
        page,
        limit,
      });
    } catch (err: any) {
      sendError(res, 500, err.message || "Lỗi máy chủ", err.details);
    }
  }

  async getAccountById(req: Request, res: Response): Promise<void> {
    try {
      const matk = Number(req.params.matk);
      const data = await accountService.getAccountById(matk);
      if (!data) {
        sendError(res, 404, "Không tìm thấy tài khoản");
        return;
      }
      sendSuccess(res, data, "Lấy chi tiết tài khoản thành công");
    } catch (err: any) {
      sendError(res, 500, err.message || "Lỗi máy chủ", err.details);
    }
  }

  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const data = await accountService.createAccount(req.body);
      sendSuccess(res, data, "Tạo tài khoản thành công", 201);
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message, err.details);
    }
  }

  async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      const matk = Number(req.params.matk);
      const data = await accountService.updateAccount(matk, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy tài khoản");
        return;
      }
      sendSuccess(res, data, "Cập nhật tài khoản thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const matk = Number(req.params.matk);
      const deleted = await accountService.deleteAccount(matk, req.user?.matk);
      if (!deleted) {
        sendError(res, 404, "Không tìm thấy tài khoản để xóa");
        return;
      }
      sendSuccess(res, { matk }, "Xóa tài khoản thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }
}

export const accountController = new AccountController();
