import { Request, Response } from "express";
import { classService } from "../services/class.service.js";

export class ClassController {
  async getClasses(req: Request, res: Response): Promise<void> {
    try {
      const { semester, courseId, departmentCode, classType, search, page, limit } = req.query;
      const data = await classService.getClasses({
        semester: semester as string,
        courseId: courseId as string,
        departmentCode: departmentCode as string,
        classType: classType as string,
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi lấy danh sách lớp học",
      });
    }
  }

  async getClassByCode(req: Request, res: Response): Promise<void> {
    try {
      const classCode = String(req.params.classCode);
      const classData = await classService.getClassByCode(classCode);
      if (!classData) {
        res.status(404).json({
          code: 404,
          message: `Không tìm thấy lớp học có mã: ${classCode}`,
        });
        return;
      }
      res.status(200).json(classData);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi lấy chi tiết lớp học",
      });
    }
  }
}

export const classController = new ClassController();
