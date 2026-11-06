import { Request, Response } from "express";
import { lecturerService } from "../services/lecturer.service.js";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class LecturerController {
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.matk) {
        sendError(res, 401, "Chưa xác thực người dùng");
        return;
      }
      const data = await lecturerService.getMe(req.user.matk);
      if (!data) {
        sendError(res, 404, "Không tìm thấy thông tin giảng viên");
        return;
      }
      sendSuccess(res, data, "Lấy thông tin giảng viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.matk) {
        sendError(res, 401, "Chưa xác thực người dùng");
        return;
      }
      const data = await lecturerService.updateMe(req.user.matk, req.body);
      sendSuccess(res, data, "Cập nhật hồ sơ thành công");
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message, err.details);
    }
  }

  async getLecturers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const data = await lecturerService.getLecturers({
        search: req.query.search as string,
        page,
        limit,
      });

      sendSuccess(res, data.items, "Lấy danh sách giảng viên thành công", 200, data.pagination);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getLecturerByMagv(req: Request, res: Response): Promise<void> {
    try {
      const magv = Number(req.params.magv);
      const data = await lecturerService.getLecturerByMagv(magv);
      if (!data) {
        sendError(res, 404, "Không tìm thấy giảng viên");
        return;
      }
      sendSuccess(res, data, "Lấy thông tin giảng viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async createLecturer(req: Request, res: Response): Promise<void> {
    try {
      const data = await lecturerService.createLecturer(req.body);
      sendSuccess(res, data, "Tạo giảng viên thành công", 201);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async updateLecturer(req: Request, res: Response): Promise<void> {
    try {
      const magv = Number(req.params.magv);
      const data = await lecturerService.updateLecturer(magv, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy giảng viên");
        return;
      }
      sendSuccess(res, data, "Cập nhật giảng viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteLecturer(req: Request, res: Response): Promise<void> {
    try {
      const magv = Number(req.params.magv);
      await lecturerService.deleteLecturer(magv);
      sendSuccess(res, { magv }, "Xóa giảng viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getMyClasses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await lecturerService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ giảng viên");
        return;
      }
      const data = await lecturerService.getMyClasses(profile.magv, req.query.semester as string);
      sendSuccess(res, data, "Lấy danh sách lớp phụ trách thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getClassesByMagv(req: Request, res: Response): Promise<void> {
    try {
      const magv = Number(req.params.magv);
      const data = await lecturerService.getMyClasses(magv, req.query.semester as string);
      sendSuccess(res, data, "Lấy danh sách lớp phụ trách thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }
}

export const lecturerController = new LecturerController();
