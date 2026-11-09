import { Request, Response } from "express";
import { gradeService } from "../services/grade.service.js";
import { studentService } from "../services/student.service.js";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class GradeController {
  async getMyGrades(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const data = await gradeService.getStudentGrades(profile.masv);
      sendSuccess(res, data, "Lấy bảng điểm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getMyGradeInClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const malh = Number(req.params.malh);
      const data = await gradeService.getStudentGradeInClass(malh, profile.masv);
      if (!data) {
        sendError(res, 404, "Chưa có điểm cho lớp học này");
        return;
      }
      sendSuccess(res, data, "Lấy điểm lớp học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async upsertMyGradeInClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await studentService.getMe(req.user!.matk);
      if (!profile) {
        sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
        return;
      }
      const malh = Number(req.params.malh);
      const { diem_qt, diem_ck, diemQt, diemCk, attendanceScore, midtermScore, practicalScore, finalExamScore } = req.body;

      let finalQt = diemQt !== undefined ? diemQt : diem_qt;
      let finalCk = diemCk !== undefined ? diemCk : diem_ck;

      if (finalQt === undefined && (attendanceScore !== undefined || midtermScore !== undefined || practicalScore !== undefined)) {
        const att = Number(attendanceScore) || 0;
        const mid = Number(midtermScore) || 0;
        const prac = Number(practicalScore) || 0;
        finalQt = Math.round((att * 0.2 + mid * 0.4 + prac * 0.4) * 10) / 10;
      }
      if (finalCk === undefined && finalExamScore !== undefined) {
        finalCk = Number(finalExamScore);
      }

      const data = await gradeService.upsertGrade({
        malh,
        masv: profile.masv,
        diemQt: finalQt,
        diemCk: finalCk,
      });

      sendSuccess(res, data, "Cập nhật điểm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getStudentGrades(req: Request, res: Response): Promise<void> {
    try {
      const masv = Number(req.params.masv);
      const data = await gradeService.getStudentGrades(masv);
      sendSuccess(res, data, "Lấy bảng điểm sinh viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getClassGrades(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await gradeService.getClassGrades(malh);
      sendSuccess(res, data, "Lấy bảng điểm lớp học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getStudentGradeInClass(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv);
      const data = await gradeService.getStudentGradeInClass(malh, masv);
      if (!data) {
        sendError(res, 404, "Không tìm thấy điểm của sinh viên trong lớp này");
        return;
      }
      sendSuccess(res, data, "Lấy điểm sinh viên trong lớp thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async upsertGrade(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv || req.body.masv);
      const { diem_qt, diem_ck, diemQt, diemCk } = req.body;

      const data = await gradeService.upsertGrade({
        malh,
        masv,
        diemQt: diemQt !== undefined ? diemQt : diem_qt,
        diemCk: diemCk !== undefined ? diemCk : diem_ck,
      });

      sendSuccess(res, data, "Cập nhật điểm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteGrade(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const masv = Number(req.params.masv);
      await gradeService.deleteGrade(malh, masv);
      sendSuccess(res, { malh, masv }, "Xóa điểm thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }
}

export const gradeController = new GradeController();
