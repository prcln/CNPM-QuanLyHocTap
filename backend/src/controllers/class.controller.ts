import { Request, Response } from "express";
import { classService } from "../services/class.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class ClassController {
  async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const data = await classService.getClasses({
        semester: req.query.semester as string,
        courseId: (req.query.courseId || req.query.mahp) as string,
        search: req.query.search as string,
        page,
        limit,
      });
      sendSuccess(res, data.items, "Lấy danh sách lớp học thành công", 200, data.pagination);
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async getClassById(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh || req.params.classCode);
      const data = await classService.getClassById(malh);
      if (!data) {
        sendError(res, 404, "Không tìm thấy lớp học");
        return;
      }
      sendSuccess(res, data, "Lấy chi tiết lớp học thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const data = await classService.createClass(req.body);
      sendSuccess(res, data, "Tạo lớp học thành công", 201);
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async updateClass(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await classService.updateClass(malh, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy lớp học");
        return;
      }
      sendSuccess(res, data, "Cập nhật lớp học thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async deleteClass(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      await classService.deleteClass(malh);
      sendSuccess(res, { malh }, "Xóa lớp học thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await classService.getStudents(malh);
      sendSuccess(res, data, "Lấy danh sách sinh viên của lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async addStudent(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv);
      await classService.addStudent(malh, masv);
      sendSuccess(res, { malh, masv }, "Thêm sinh viên vào lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async removeStudent(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv);
      await classService.removeStudent(malh, masv);
      sendSuccess(res, { malh, masv }, "Xóa sinh viên khỏi lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async getLecturers(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await classService.getLecturers(malh);
      sendSuccess(res, data, "Lấy danh sách giảng viên của lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async addLecturer(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const magv = Number(req.params.magv);
      await classService.addLecturer(malh, magv);
      sendSuccess(res, { malh, magv }, "Gán giảng viên vào lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async removeLecturer(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const magv = Number(req.params.magv);
      await classService.removeLecturer(malh, magv);
      sendSuccess(res, { malh, magv }, "Bỏ giảng viên khỏi lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async getTeachingAssistants(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await classService.getTeachingAssistants(malh);
      sendSuccess(res, data, "Lấy danh sách trợ giảng của lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async addTeachingAssistant(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv);
      await classService.addTeachingAssistant(malh, masv);
      sendSuccess(res, { malh, masv }, "Gán trợ giảng vào lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async removeTeachingAssistant(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv);
      await classService.removeTeachingAssistant(malh, masv);
      sendSuccess(res, { malh, masv }, "Bỏ trợ giảng khỏi lớp thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }
}

export const classController = new ClassController();
