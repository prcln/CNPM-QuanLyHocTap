import { Request, Response } from "express";
import { assignmentService } from "../services/assignment.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class AssignmentController {
  async getAssignmentsByClass(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await assignmentService.getAssignmentsByClass(malh);
      sendSuccess(res, data, "Lấy danh sách bài tập thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getAssignmentById(req: Request, res: Response): Promise<void> {
    try {
      const mabt = Number(req.params.mabt);
      const data = await assignmentService.getAssignmentById(mabt);
      if (!data) {
        sendError(res, 404, "Không tìm thấy bài tập");
        return;
      }
      sendSuccess(res, data, "Lấy chi tiết bài tập thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async createAssignment(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh || req.body.malh);
      const { loai, noi_dung, noiDung, deadline, due_date, dueDate } = req.body;
      const data = await assignmentService.createAssignment({
        malh,
        loai: loai || req.body.title || "Bài tập lớn",
        noiDung: noiDung || noi_dung || req.body.description,
        deadline: deadline || due_date || dueDate ? new Date(deadline || due_date || dueDate) : undefined,
      });
      sendSuccess(res, data, "Tạo bài tập thành công", 201);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async updateAssignment(req: Request, res: Response): Promise<void> {
    try {
      const mabt = Number(req.params.mabt);
      const data = await assignmentService.updateAssignment(mabt, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy bài tập");
        return;
      }
      sendSuccess(res, data, "Cập nhật bài tập thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteAssignment(req: Request, res: Response): Promise<void> {
    try {
      const mabt = Number(req.params.mabt);
      await assignmentService.deleteAssignment(mabt);
      sendSuccess(res, { mabt }, "Xóa bài tập thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getGroups(req: Request, res: Response): Promise<void> {
    try {
      const mabt = Number(req.params.mabt);
      const data = await assignmentService.getGroups(mabt);
      sendSuccess(res, data, "Lấy danh sách nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getGroupById(req: Request, res: Response): Promise<void> {
    try {
      const manhom = Number(req.params.manhom);
      const data = await assignmentService.getGroupById(manhom);
      if (!data) {
        sendError(res, 404, "Không tìm thấy nhóm");
        return;
      }
      sendSuccess(res, data, "Lấy chi tiết nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const mabt = Number(req.params.mabt);
      const data = await assignmentService.createGroup({
        mabt,
        deTai: req.body.deTai || req.body.de_tai,
      });
      sendSuccess(res, data, "Tạo nhóm thành công", 201);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async updateGroup(req: Request, res: Response): Promise<void> {
    try {
      const manhom = Number(req.params.manhom);
      const data = await assignmentService.updateGroup(manhom, {
        deTai: req.body.deTai || req.body.de_tai,
      });
      if (!data) {
        sendError(res, 404, "Không tìm thấy nhóm");
        return;
      }
      sendSuccess(res, data, "Cập nhật nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteGroup(req: Request, res: Response): Promise<void> {
    try {
      const manhom = Number(req.params.manhom);
      await assignmentService.deleteGroup(manhom);
      sendSuccess(res, { manhom }, "Xóa nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getGroupMembers(req: Request, res: Response): Promise<void> {
    try {
      const manhom = Number(req.params.manhom);
      const data = await assignmentService.getGroupMembers(manhom);
      sendSuccess(res, data, "Lấy danh sách thành viên nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const manhom = Number(req.params.manhom);
      const masv = Number(req.params.masv);
      await assignmentService.addMember(manhom, masv);
      sendSuccess(res, { manhom, masv }, "Thêm thành viên vào nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const manhom = Number(req.params.manhom);
      const masv = Number(req.params.masv);
      await assignmentService.removeMember(manhom, masv);
      sendSuccess(res, { manhom, masv }, "Xóa thành viên khỏi nhóm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }
}

export const assignmentController = new AssignmentController();
