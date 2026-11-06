import { studentRepository, StudentData } from "../repositories/student.repository.js";
import { gradeRepository } from "../repositories/grade.repository.js";

export class StudentService {
  async getMe(matk: number) {
    return studentRepository.findByMatk(matk);
  }

  async updateMe(matk: number, data: { email?: string; chuong_trinh?: string; lop?: string }) {
    const student = await studentRepository.findByMatk(matk);
    if (!student) {
      const err: any = new Error("Không tìm thấy hồ sơ sinh viên");
      err.statusCode = 404;
      throw err;
    }
    const safeData: Partial<StudentData> = {};
    if (data.email !== undefined) safeData.email = data.email;
    if (data.chuong_trinh !== undefined) safeData.chuong_trinh = data.chuong_trinh;
    if (data.lop !== undefined) safeData.lop = data.lop;
    return studentRepository.update(student.masv, safeData);
  }

  async getStudents(filters: { search?: string; khoa?: number; lop?: string; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const res = await studentRepository.findAll({ ...filters, limit, offset });
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

  async getStudentByMasv(masv: number) {
    return studentRepository.findByMasv(masv);
  }

  async createStudent(data: StudentData) {
    return studentRepository.create(data);
  }

  async updateStudent(masv: number, data: Partial<StudentData>) {
    return studentRepository.update(masv, data);
  }

  async deleteStudent(masv: number) {
    return studentRepository.softDelete(masv);
  }

  async getMyClasses(masv: number, semester?: string) {
    return studentRepository.getClassesByStudent(masv, semester);
  }

  async registerClass(masv: number, malh: number) {
    return studentRepository.registerClass(masv, malh);
  }

  async unregisterClass(masv: number, malh: number) {
    return studentRepository.unregisterClass(masv, malh);
  }

  async getGpa(masv: number, semester?: string) {
    const grades = await gradeRepository.getGradesByStudent(masv);
    if (grades.length === 0) return { semester: semester || "20261", gpa10: 0, gpa4: 0, totalCredits: 0 };

    let totalCredits = 0;
    let weighted10 = 0;
    let weighted4 = 0;

    for (const g of grades) {
      const credits = Number(g.tinChi || 3);
      const qt = Number(g.diemQt || 0);
      const ck = Number(g.diemCk || 0);
      const wQt = Number(g.trongsoQt || 0.4);
      const score10 = Math.round((qt * wQt + ck * (1 - wQt)) * 10) / 10;

      let score4 = 0;
      if (ck < 3.0) score4 = 0;
      else if (score10 >= 9.0) score4 = 4.0;
      else if (score10 >= 8.5) score4 = 3.7;
      else if (score10 >= 8.0) score4 = 3.5;
      else if (score10 >= 7.0) score4 = 3.0;
      else if (score10 >= 6.5) score4 = 2.5;
      else if (score10 >= 5.5) score4 = 2.0;
      else if (score10 >= 5.0) score4 = 1.5;
      else if (score10 >= 4.0) score4 = 1.0;

      totalCredits += credits;
      weighted10 += score10 * credits;
      weighted4 += score4 * credits;
    }

    const gpa10 = totalCredits > 0 ? Math.round((weighted10 / totalCredits) * 100) / 100 : 0;
    const gpa4 = totalCredits > 0 ? Math.round((weighted4 / totalCredits) * 100) / 100 : 0;

    return {
      semester: semester || "20261",
      gpa10,
      gpa4,
      totalCredits,
    };
  }

  async getCpa(masv: number) {
    const student = await studentRepository.findByMasv(masv);
    const gpaRes = await this.getGpa(masv);
    return {
      masv,
      cpa: student?.cpa ? Number(student.cpa) : gpaRes.gpa4,
      totalAccumulatedCredits: gpaRes.totalCredits,
      standing: gpaRes.gpa4 >= 3.6 ? "Xuất sắc" : gpaRes.gpa4 >= 3.2 ? "Giỏi" : gpaRes.gpa4 >= 2.5 ? "Khá" : "Trung bình",
    };
  }
}

export const studentService = new StudentService();

