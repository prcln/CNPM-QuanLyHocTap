import { Request, Response } from "express";
import { courseService } from "../services/course.service.js";

export class CourseController {
  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const { search, isOffered, page, limit } = req.query;
      const data = await courseService.getCourses({
        search: search as string,
        isOffered: isOffered !== undefined ? isOffered === "true" || isOffered === "1" : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi lấy danh sách học phần",
      });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const course = await courseService.getCourseById(id);
      if (!course) {
        res.status(404).json({
          code: 404,
          message: `Không tìm thấy học phần có mã: ${id}`,
        });
        return;
      }
      res.status(200).json(course);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi lấy chi tiết học phần",
      });
    }
  }
}

export const courseController = new CourseController();
