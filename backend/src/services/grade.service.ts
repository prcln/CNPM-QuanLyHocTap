import { gradeRepository, GradeItem } from "../repositories/grade.repository.js";

export function computeHustScore(diemQtStr: string | null, diemCkStr: string | null, trongsoQtStr: string | null = "0.40") {
  const qt = Math.max(0, Math.min(10, Number(diemQtStr) || 0));
  const ck = Math.max(0, Math.min(10, Number(diemCkStr) || 0));
  const wQt = Math.max(0, Math.min(1, Number(trongsoQtStr) || 0.40));
  const wCk = Math.round((1 - wQt) * 100) / 100;

  const raw10 = qt * wQt + ck * wCk;
  const diemHpSo = Math.round(raw10 * 10) / 10;

  let diemChu = "F";
  let diemHp4 = 0.0;

  if (ck < 3.0) {
    diemChu = "F";
    diemHp4 = 0.0;
  } else if (diemHpSo >= 9.0) {
    diemChu = "A+";
    diemHp4 = 4.0;
  } else if (diemHpSo >= 8.5) {
    diemChu = "A";
    diemHp4 = 3.7;
  } else if (diemHpSo >= 8.0) {
    diemChu = "B+";
    diemHp4 = 3.5;
  } else if (diemHpSo >= 7.0) {
    diemChu = "B";
    diemHp4 = 3.0;
  } else if (diemHpSo >= 6.5) {
    diemChu = "C+";
    diemHp4 = 2.5;
  } else if (diemHpSo >= 5.5) {
    diemChu = "C";
    diemHp4 = 2.0;
  } else if (diemHpSo >= 5.0) {
    diemChu = "D+";
    diemHp4 = 1.5;
  } else if (diemHpSo >= 4.0) {
    diemChu = "D";
    diemHp4 = 1.0;
  }

  return { diemHpSo, diemHp4, diemChu };
}

export class GradeService {
  async getStudentGrades(masv: number, malh?: number) {
    const list = await gradeRepository.getGradesByStudent(masv, malh);
    return list.map((g) => {
      const calc = computeHustScore(g.diemQt, g.diemCk, g.trongsoQt);
      return {
        ...g,
        diemQt: g.diemQt ? Number(g.diemQt) : null,
        diemCk: g.diemCk ? Number(g.diemCk) : null,
        diemHpSo: calc.diemHpSo,
        diemHp4: calc.diemHp4,
        diemChu: calc.diemChu,
      };
    });
  }

  async getClassGrades(malh: number) {
    const list = await gradeRepository.getGradesByClass(malh);
    return list.map((g) => {
      const calc = computeHustScore(g.diemQt, g.diemCk, g.trongsoQt);
      return {
        ...g,
        diemQt: g.diemQt ? Number(g.diemQt) : null,
        diemCk: g.diemCk ? Number(g.diemCk) : null,
        diemHpSo: calc.diemHpSo,
        diemHp4: calc.diemHp4,
        diemChu: calc.diemChu,
      };
    });
  }

  async getStudentGradeInClass(malh: number, masv: number) {
    const g = await gradeRepository.getGradeByClassAndStudent(malh, masv);
    if (!g) return null;
    const calc = computeHustScore(g.diemQt, g.diemCk, g.trongsoQt);
    return {
      ...g,
      diemQt: g.diemQt ? Number(g.diemQt) : null,
      diemCk: g.diemCk ? Number(g.diemCk) : null,
      diemHpSo: calc.diemHpSo,
      diemHp4: calc.diemHp4,
      diemChu: calc.diemChu,
    };
  }

  async upsertGrade(data: { masv: number; malh: number; diemQt?: number; diemCk?: number }) {
    const res = await gradeRepository.upsertGrade(data);
    const calc = computeHustScore(res.diemQt, res.diemCk, res.trongsoQt);
    return {
      ...res,
      diemQt: res.diemQt ? Number(res.diemQt) : null,
      diemCk: res.diemCk ? Number(res.diemCk) : null,
      diemHpSo: calc.diemHpSo,
      diemHp4: calc.diemHp4,
      diemChu: calc.diemChu,
    };
  }

  async deleteGrade(malh: number, masv: number) {
    return gradeRepository.deleteGrade(malh, masv);
  }
}

export const gradeService = new GradeService();

