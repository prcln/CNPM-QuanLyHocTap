/**
 * CNPM - QLHT - Grade Utilities
 * Adheres to HUST standard grading rules and Guardrail 3 (trongso_qt & diem_ck).
 */

export interface HustGradeResult {
  diemHpSo: number       // Điểm học phần thang 10 (làm tròn 1 chữ số thập phân)
  diemHp4: number        // Điểm học phần thang 4 (GPA)
  diemChu: string        // Điểm chữ (A+, A, B+, B, C+, C, D+, D, F)
  overallScore: number   // Alias for diemHpSo (for UI compatibility)
  gpaScore: number       // Alias for diemHp4 (for UI compatibility)
  letterGrade: string    // Alias for diemChu (for UI compatibility)
}

/**
 * Tính điểm học phần theo chuẩn quy chế đào tạo tín chỉ ĐHBK Hà Nội (HUST):
 * Điểm HP = Điểm Quá Trình * Trọng số QT + Điểm Cuối Kỳ * (1 - Trọng số QT)
 * 
 * @param diemQt Điểm quá trình (hệ 10)
 * @param diemCk Điểm thi cuối kỳ (hệ 10)
 * @param trongSoQt Trọng số quá trình (mặc định 0.40, lấy từ lop_hoc.trongso_qt)
 */
export const calculateHustGrade = (
  diemQt: number,
  diemCk: number,
  trongSoQt = 0.40,
): HustGradeResult => {
  const safeQt = Math.max(0, Math.min(10, Number(diemQt) || 0))
  const safeCk = Math.max(0, Math.min(10, Number(diemCk) || 0))
  const safeWeight = Math.max(0, Math.min(1, Number(trongSoQt) || 0.40))
  const weightCk = Math.round((1 - safeWeight) * 100) / 100

  // Công thức chuẩn: QT * w + CK * (1 - w)
  const rawScore = safeQt * safeWeight + safeCk * weightCk
  const diemHpSo = Math.round(rawScore * 10) / 10

  let diemChu = 'F'
  let diemHp4 = 0.0

  // Điều kiện qua môn: Điểm cuối kỳ không được liệt (< 3.0) và điểm tổng kết >= 4.0
  if (safeCk < 3.0) {
    diemChu = 'F'
    diemHp4 = 0.0
  } else if (diemHpSo >= 9.0) {
    diemChu = 'A+'
    diemHp4 = 4.0
  } else if (diemHpSo >= 8.5) {
    diemChu = 'A'
    diemHp4 = 3.7
  } else if (diemHpSo >= 8.0) {
    diemChu = 'B+'
    diemHp4 = 3.5
  } else if (diemHpSo >= 7.0) {
    diemChu = 'B'
    diemHp4 = 3.0
  } else if (diemHpSo >= 6.5) {
    diemChu = 'C+'
    diemHp4 = 2.5
  } else if (diemHpSo >= 5.5) {
    diemChu = 'C'
    diemHp4 = 2.0
  } else if (diemHpSo >= 5.0) {
    diemChu = 'D+'
    diemHp4 = 1.5
  } else if (diemHpSo >= 4.0) {
    diemChu = 'D'
    diemHp4 = 1.0
  } else {
    diemChu = 'F'
    diemHp4 = 0.0
  }

  return {
    diemHpSo,
    diemHp4,
    diemChu,
    overallScore: diemHpSo,
    gpaScore: diemHp4,
    letterGrade: diemChu,
  }
}

/**
 * Hàm tương thích ngược với UI và mockDb cũ.
 * Chuyển đổi 3 đầu điểm thành phần thành Điểm Quá Trình (diemQt), sau đó tính cùng Final Exam.
 */
export const calculateGradeDetail = (
  attendance: number,
  midterm: number,
  practical: number,
  finalExam: number,
  trongSoQt = 0.40,
): { overallScore: number; gpaScore: number; letterGrade: string; diemQt: number; diemCk: number } => {
  // Điểm quá trình = Chuyên cần (20%) + Giữa kỳ (40%) + Bài tập/Thực hành (40%)
  const safeAtt = Math.max(0, Math.min(10, Number(attendance) || 0))
  const safeMid = Math.max(0, Math.min(10, Number(midterm) || 0))
  const safePrac = Math.max(0, Math.min(10, Number(practical) || 0))
  const safeCk = Math.max(0, Math.min(10, Number(finalExam) || 0))

  const diemQt = Math.round((safeAtt * 0.2 + safeMid * 0.4 + safePrac * 0.4) * 10) / 10
  const result = calculateHustGrade(diemQt, safeCk, trongSoQt)

  return {
    overallScore: result.diemHpSo,
    gpaScore: result.diemHp4,
    letterGrade: result.diemChu,
    diemQt,
    diemCk: safeCk,
  }
}
