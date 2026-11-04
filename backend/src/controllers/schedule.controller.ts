import { Request, Response } from "express";
import { scheduleService } from "../services/schedule.service.js";

export class ScheduleController {
  async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const { classCode, dayOfWeek, room, shift, page, limit } = req.query;
      const data = await scheduleService.getSchedules({
        classCode: classCode as string,
        dayOfWeek: dayOfWeek !== undefined ? Number(dayOfWeek) : undefined,
        room: room as string,
        shift: shift as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi lấy danh sách lịch học",
      });
    }
  }

  async getTimetable(req: Request, res: Response): Promise<void> {
    try {
      const { semester, dayOfWeek, room, classCode, courseId, week, search, page, limit } = req.query;
      const data = await scheduleService.getTimetable({
        semester: semester as string,
        dayOfWeek: dayOfWeek !== undefined ? Number(dayOfWeek) : undefined,
        room: room as string,
        classCode: classCode as string,
        courseId: courseId as string,
        week: week !== undefined ? Number(week) : undefined,
        search: search as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi truy vấn thời khóa biểu",
      });
    }
  }
}

export const scheduleController = new ScheduleController();
