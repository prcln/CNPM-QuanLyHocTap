import { lecturerRepository, LecturerData } from "../repositories/lecturer.repository.js";

export class LecturerService {
  async getMe(matk: number) {
    return lecturerRepository.findByMatk(matk);
  }

  async updateMe(matk: number, data: { email?: string; truong?: string }) {
    const lecturer = await lecturerRepository.findByMatk(matk);
    if (!lecturer) {
      const err: any = new Error("Không tìm thấy hồ sơ giảng viên");
      err.statusCode = 404;
      throw err;
    }
    const safeData: Partial<LecturerData> = {};
    if (data.email !== undefined) safeData.email = data.email;
    if (data.truong !== undefined) safeData.truong = data.truong;
    return lecturerRepository.update(lecturer.magv, safeData);
  }

  async getLecturers(filters: { search?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const res = await lecturerRepository.findAll({ search: filters.search, limit, offset });
    return {
      items: res.items,
      pagination: {
        total: res.total,
        page,
        limit,
        totalPages: Math.ceil(res.total / limit),
      },
    };
  }

  async getLecturerByMagv(magv: number) {
    return lecturerRepository.findByMagv(magv);
  }

  async createLecturer(data: LecturerData) {
    return lecturerRepository.create(data);
  }

  async updateLecturer(magv: number, data: Partial<LecturerData>) {
    return lecturerRepository.update(magv, data);
  }

  async deleteLecturer(magv: number) {
    return lecturerRepository.softDelete(magv);
  }

  async getMyClasses(magv: number, semester?: string) {
    return lecturerRepository.getClassesByLecturer(magv, semester);
  }
}

export const lecturerService = new LecturerService();

