import { Request, Response } from "express";
import { studentService } from "../services/student.service.js";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class StudentController {
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.matk) {
        sendError(res, 401, "Chưa xác thực người dùng");
        return;
      }
      const data = await studentService.getMe(req.user.matk);
      if (!data) {
        sendError(res, 404, "Không tìm thấy thông tin sinh viên");
        return;
      }
      sendSuccess(res, data, "Lấy thông tin sinh viên thành công");
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
      const data = await studentService.updateMe(req.user.matk, req.body);
      sendSuccess(res, data, "Cập nhật hồ sơ thành công");
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message, err.details);
    }
  }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const data = await studentService.getStudents({
        search: req.query.search as string,
        khoa: req.query.khoa ? Number(req.query.khoa) : undefined,
        lop: req.query.lop as string,
        page,
        limit,
      });

      sendSuccess(res, data.items, "Lấy danh sách sinh viên thành công", 200, data.pagination);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getStudentByMasv(req: Request, res: Response): Promise<void> {
    try {
      const masv = Number(req.params.masv);
      const data = await studentService.getStudentByMasv(masv);
      if (!data) {
        sendError(res, 404, "Không tìm thấy sinh viên");
        return;
      }
      sendSuccess(res, data, "Lấy thông tin sinh viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async createStudent(req: Request, res: Response): Promise<void> {
    try {
      const data = await studentService.createStudent(req.body);
      sendSuccess(res, data, "Tạo sinh viên thành công", 201);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async updateStudent(req: Request, res: Response): Promise<void> {
    try {
      const masv = Number(req.params.masv);
      const data = await studentService.updateStudent(masv, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy sinh viên");
        return;
      }
      sendSuccess(res, data, "Cập nhật sinh viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteStudent(req: Request, res: Response): Promise<void> {
    try {
      const masv = Number(req.params.masv);
      await studentService.deleteStudent(masv);
      sendSuccess(res, { masv }, "Xóa sinh viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getMyClasses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const data = await studentService.getMyClasses(profile.masv, req.query.semester as string);
      sendSuccess(res, data, "Lấy danh sách lớp học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async registerClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const malh = Number(req.params.malh);
      await studentService.registerClass(profile.masv, malh);
      sendSuccess(res, { masv: profile.masv, malh }, "Đăng ký lớp thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async unregisterClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const malh = Number(req.params.malh);
      await studentService.unregisterClass(profile.masv, malh);
      sendSuccess(res, { masv: profile.masv, malh }, "Hủy đăng ký lớp thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getGpa(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const data = await studentService.getGpa(profile.masv, req.query.semester as string);
      sendSuccess(res, data, "Lấy điểm GPA thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getCpa(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const data = await studentService.getCpa(profile.masv);
      sendSuccess(res, data, "Lấy điểm CPA thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const data = await studentService.getStats(profile.masv);
      sendSuccess(res, data, "Lấy thống kê học tập sinh viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }
}

export const studentController = new StudentController();
