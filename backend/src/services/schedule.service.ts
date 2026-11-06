import { scheduleRepository, ScheduleItem } from "../repositories/schedule.repository.js";

export class ScheduleService {
  async getStudentSchedule(masv: number, semester?: string) {
    return scheduleRepository.getScheduleByStudent(masv, semester);
  }

  async getLecturerSchedule(magv: number, semester?: string) {
    return scheduleRepository.getScheduleByLecturer(magv, semester);
  }

  async getClassSchedule(malh: number) {
    return scheduleRepository.getScheduleByClass(malh);
  }

  async getSchedules() {
    return scheduleRepository.findAll();
  }

  async getScheduleById(malichhoc: number) {
    return scheduleRepository.findById(malichhoc);
  }

  async createSchedule(data: { malh: number; ngayTrongTuan: number; tietBatDau: number; tietKetThuc: number; diaDiem: string; phongHoc?: string }) {
    return scheduleRepository.create(data);
  }

  async updateSchedule(malichhoc: number, data: Partial<ScheduleItem>) {
    return scheduleRepository.update(malichhoc, data);
  }

  async deleteSchedule(malichhoc: number) {
    return scheduleRepository.delete(malichhoc);
  }

  async getTimetable() {
    return scheduleRepository.findAll();
  }
}

export const scheduleService = new ScheduleService();
