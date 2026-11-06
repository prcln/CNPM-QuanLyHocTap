import { Request, Response } from "express";
import { scheduleService } from "../services/schedule.service.js";
import { studentService } from "../services/student.service.js";
import { lecturerService } from "../services/lecturer.service.js";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export class ScheduleController {
  async getMySchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const matk = req.user!.matk;
      const role = req.user!.role;

      if (role === "SV") {
        const student = await studentService.getMe(matk);
        if (!student) {
          sendError(res, 404, "Không tìm thấy hồ sơ sinh viên");
          return;
        }
        const data = await scheduleService.getStudentSchedule(student.masv, req.query.semester as string);
        sendSuccess(res, data, "Lấy thời khóa biểu sinh viên thành công");
      } else if (role === "GV") {
        const lecturer = await lecturerService.getMe(matk);
        if (!lecturer) {
          sendError(res, 404, "Không tìm thấy hồ sơ giảng viên");
          return;
        }
        const data = await scheduleService.getLecturerSchedule(lecturer.magv, req.query.semester as string);
        sendSuccess(res, data, "Lấy lịch giảng dạy thành công");
      } else {
        const data = await scheduleService.getSchedules();
        sendSuccess(res, data, "Lấy danh sách lịch học thành công");
      }
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getStudentSchedule(req: Request, res: Response): Promise<void> {
    try {
      const masv = Number(req.params.masv);
      const data = await scheduleService.getStudentSchedule(masv, req.query.semester as string);
      sendSuccess(res, data, "Lấy thời khóa biểu sinh viên thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getLecturerSchedule(req: Request, res: Response): Promise<void> {
    try {
      const magv = Number(req.params.magv);
      const data = await scheduleService.getLecturerSchedule(magv, req.query.semester as string);
      sendSuccess(res, data, "Lấy lịch giảng dạy thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getClassSchedule(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh);
      const data = await scheduleService.getClassSchedule(malh);
      sendSuccess(res, data, "Lấy lịch học của lớp thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const data = await scheduleService.getSchedules();
      sendSuccess(res, data, "Lấy danh sách lịch học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.malichhoc);
      const data = await scheduleService.getScheduleById(id);
      if (!data) {
        sendError(res, 404, "Không tìm thấy lịch học");
        return;
      }
      sendSuccess(res, data, "Lấy chi tiết lịch học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const malh = Number(req.params.malh || req.body.malh);
      const data = await scheduleService.createSchedule({
        malh,
        ngayTrongTuan: Number(req.body.ngayTrongTuan || req.body.ngay_trong_tuan),
        tietBatDau: Number(req.body.tietBatDau || req.body.tiet_bat_dau),
        tietKetThuc: Number(req.body.tietKetThuc || req.body.tiet_ket_thuc),
        diaDiem: req.body.diaDiem || req.body.dia_diem,
        phongHoc: req.body.phongHoc || req.body.phong_hoc,
      });
      sendSuccess(res, data, "Tạo lịch học thành công", 201);
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.malichhoc);
      const data = await scheduleService.updateSchedule(id, req.body);
      if (!data) {
        sendError(res, 404, "Không tìm thấy lịch học");
        return;
      }
      sendSuccess(res, data, "Cập nhật lịch học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.malichhoc);
      await scheduleService.deleteSchedule(id);
      sendSuccess(res, { malichhoc: id }, "Xóa lịch học thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }

  async getTimetable(req: Request, res: Response): Promise<void> {
    try {
      const data = await scheduleService.getTimetable();
      sendSuccess(res, data, "Lấy dữ liệu thời khóa biểu thành công");
    } catch (err: any) {
      sendError(res, 500, err.message, err.details);
    }
  }
}

export const scheduleController = new ScheduleController();
