import { Request, Response } from "express";
import { activityService } from "../services/activity.service.js";
import { studentService } from "../services/student.service.js";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class ActivityController {
  private async getStudentMasv(req: AuthenticatedRequest): Promise<number> {
    if (req.user?.matk) {
      const student = await studentService.getMe(req.user.matk);
      if (student) return student.masv;
    }
    return 20210001; // Mặc định tài khoản sinh viên demo
  }

  async getActivities(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const masv = await this.getStudentMasv(req);
      const category = req.query.category as string | undefined;
      const registeredOnly = req.query.registeredOnly === "true";
      const data = await activityService.getActivities(masv, category, registeredOnly);
      sendSuccess(res, data, "Lấy danh sách hoạt động ngoại khóa thành công");
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message, err.details);
    }
  }

  async toggleRegister(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const masv = await this.getStudentMasv(req);
      const activityId = String(req.params.id);
      const data = await activityService.toggleRegister(masv, activityId);
      sendSuccess(res, data, "Cập nhật đăng ký hoạt động thành công");
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message, err.details);
    }
  }

  async getDrlSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const masv = await this.getStudentMasv(req);
      const data = await activityService.getDrlSummary(masv);
      sendSuccess(res, data, "Lấy bảng tổng hợp điểm rèn luyện thành công");
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message, err.details);
    }
  }
}

export const activityController = new ActivityController();
