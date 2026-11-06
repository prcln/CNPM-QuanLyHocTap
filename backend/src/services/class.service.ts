import { classRepository, ClassData } from "../repositories/class.repository.js";

export interface ClassQueryFilters {
  semester?: string;
  courseId?: string;
  departmentCode?: string;
  classType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class ClassService {
  async getClasses(filters: ClassQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const res = await classRepository.findAll({
      semester: filters.semester,
      courseId: filters.courseId,
      search: filters.search,
      limit,
      offset,
    });

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

  async getClassById(malh: number) {
    return classRepository.findByMalh(malh);
  }

  async createClass(data: Omit<ClassData, "malh">) {
    return classRepository.create(data);
  }

  async updateClass(malh: number, data: Partial<ClassData>) {
    return classRepository.update(malh, data);
  }

  async deleteClass(malh: number) {
    return classRepository.softDelete(malh);
  }

  async getStudents(malh: number) {
    return classRepository.getStudentsInClass(malh);
  }

  async addStudent(malh: number, masv: number) {
    return classRepository.addStudentToClass(malh, masv);
  }

  async removeStudent(malh: number, masv: number) {
    return classRepository.removeStudentFromClass(malh, masv);
  }

  async getLecturers(malh: number) {
    return classRepository.getLecturersInClass(malh);
  }

  async addLecturer(malh: number, magv: number) {
    return classRepository.addLecturerToClass(malh, magv);
  }

  async removeLecturer(malh: number, magv: number) {
    return classRepository.removeLecturerFromClass(malh, magv);
  }

  async getTeachingAssistants(malh: number) {
    return classRepository.getTeachingAssistants(malh);
  }

  async addTeachingAssistant(malh: number, masv: number) {
    return classRepository.addTeachingAssistant(malh, masv);
  }

  async removeTeachingAssistant(malh: number, masv: number) {
    return classRepository.removeTeachingAssistant(malh, masv);
  }
}

export const classService = new ClassService();
