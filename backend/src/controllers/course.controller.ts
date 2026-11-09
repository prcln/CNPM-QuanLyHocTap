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
      const mahp = String(req.body.mahp || req.body.code || "").trim().toUpperCase();
      const ten = String(req.body.ten || req.body.name || "").trim();
      const truong = req.body.truong || req.body.departmentCode || req.body.instructor || "Trường CNTT & TT";
      const batBuoc = req.body.batBuoc ?? req.body.isCompulsory ?? true;
      const tinChiDaoTao = Number(req.body.tinChiDaoTao ?? req.body.credits ?? 3);
      const tinChiHocPhi = Number(req.body.tinChiHocPhi ?? req.body.tuitionCredits ?? tinChiDaoTao);
      const phanBo = req.body.phanBo || req.body.allocation || `${tinChiDaoTao}(2-1-0-6)`;
      const noiDung = req.body.noiDung || req.body.description || "";

      const data = await courseService.createCourse({
        mahp,
        ten,
        truong,
        batBuoc,
        tinChiDaoTao,
        tinChiHocPhi,
        phanBo,
        noiDung,
      });

      const responseData = {
        ...data,
        id: data.mahp,
        code: data.mahp,
        name: data.ten,
        instructor: truong,
        credits: tinChiDaoTao,
        description: noiDung,
        semester: req.body.semester || "20261",
        status: req.body.status || "active",
        schedule: req.body.schedule,
        colorTag: req.body.colorTag,
      };

      sendSuccess(res, responseData, "Tạo học phần thành công", 201);
    } catch (error: any) {
      sendError(res, 500, error.message, error.details);
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const updatePayload: any = {};
      if (req.body.ten || req.body.name) updatePayload.ten = req.body.ten || req.body.name;
      if (req.body.truong || req.body.departmentCode || req.body.instructor) {
        updatePayload.truong = req.body.truong || req.body.departmentCode || req.body.instructor;
      }
      if (req.body.batBuoc !== undefined || req.body.isCompulsory !== undefined) {
        updatePayload.batBuoc = req.body.batBuoc ?? req.body.isCompulsory;
      }
      if (req.body.tinChiDaoTao !== undefined || req.body.credits !== undefined) {
        updatePayload.tinChiDaoTao = Number(req.body.tinChiDaoTao ?? req.body.credits);
      }
      if (req.body.tinChiHocPhi !== undefined || req.body.tuitionCredits !== undefined) {
        updatePayload.tinChiHocPhi = Number(req.body.tinChiHocPhi ?? req.body.tuitionCredits);
      }
      if (req.body.phanBo || req.body.allocation) updatePayload.phanBo = req.body.phanBo || req.body.allocation;
      if (req.body.noiDung !== undefined || req.body.description !== undefined) {
        updatePayload.noiDung = req.body.noiDung ?? req.body.description;
      }

      const data = await courseService.updateCourse(id, Object.keys(updatePayload).length > 0 ? updatePayload : req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy học phần");
        return;
      }

      const responseData = {
        ...data,
        id: data.mahp,
        code: data.mahp,
        name: data.ten,
        instructor: data.truong || req.body.instructor || "Bộ môn phân công",
        credits: data.tinChiDaoTao,
        description: data.noiDung,
        semester: req.body.semester || "20261",
        status: req.body.status || "active",
        schedule: req.body.schedule,
        colorTag: req.body.colorTag,
      };

      sendSuccess(res, responseData, "Cập nhật học phần thành công");
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
