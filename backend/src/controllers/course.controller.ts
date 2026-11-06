import { Request, Response } from "express";
import { courseService } from "../services/course.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class CourseController {
  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      const data = await courseService.getCourses({
        search: req.query.search as string,
        page,
        limit,
      });
      sendSuccess(res, data.items, "Lấy danh sách học phần thành công", 200, data.pagination);
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await courseService.getCourseById(id);
      if (!data) {
        sendError(res, 404, "Không tìm thấy học phần");
        return;
      }
      sendSuccess(res, data, "Lấy chi tiết học phần thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const data = await courseService.createCourse(req.body);
      sendSuccess(res, data, "Tạo học phần thành công", 201);
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const data = await courseService.updateCourse(id, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy học phần");
        return;
      }
      sendSuccess(res, data, "Cập nhật học phần thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await courseService.deleteCourse(id);
      sendSuccess(res, { id }, "Xóa học phần thành công");
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }
}

export const courseController = new CourseController();
