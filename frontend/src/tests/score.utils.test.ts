import { describe, it, expect } from 'vitest'
import { calculateHustGrade, calculateGradeDetail } from '../lib/score.utils'

describe('HUST Score & GPA Calculation Suite (Guardrail 3)', () => {
  it('tính đúng điểm tổng kết hệ 10 theo trọng số quá trình và cuối kỳ', () => {
    // diemQt = 8.0, diemCk = 9.0, trongso_qt = 0.4
    // 8.0 * 0.4 + 9.0 * 0.6 = 3.2 + 5.4 = 8.6
    const res = calculateHustGrade(8.0, 9.0, 0.4)
    expect(res.diemHpSo).toBe(8.6)
    expect(res.diemChu).toBe('A')
    expect(res.diemHp4).toBe(3.7)
  })

  it('đạt A+ khi điểm tổng kết >= 9.0', () => {
    const res = calculateHustGrade(9.5, 9.0, 0.3) // 9.5 * 0.3 + 9.0 * 0.7 = 2.85 + 6.3 = 9.15 -> 9.2
    expect(res.diemHpSo).toBeGreaterThanOrEqual(9.0)
    expect(res.diemChu).toBe('A+')
    expect(res.diemHp4).toBe(4.0)
  })

  it('bị điểm F (liệt) khi điểm thi cuối kỳ < 3.0 dù điểm quá trình 10', () => {
    // Điểm thi cuối kỳ dưới 3.0 bị liệt theo quy chế ĐHBK
    const res = calculateHustGrade(10, 2.5, 0.5)
    expect(res.diemChu).toBe('F')
    expect(res.diemHp4).toBe(0.0)
  })

  it('bị điểm F khi điểm tổng kết < 4.0', () => {
    const res = calculateHustGrade(4.0, 3.5, 0.4) // 4*0.4 + 3.5*0.6 = 1.6 + 2.1 = 3.7
    expect(res.diemHpSo).toBe(3.7)
    expect(res.diemChu).toBe('F')
    expect(res.diemHp4).toBe(0.0)
  })

  it('tính đúng các dải điểm B+, B, C+, C, D+, D', () => {
    // B+ (8.0 - 8.4)
    expect(calculateHustGrade(8.0, 8.2, 0.4).diemChu).toBe('B+')
    // B (7.0 - 7.9)
    expect(calculateHustGrade(7.0, 7.5, 0.4).diemChu).toBe('B')
    // C+ (6.5 - 6.9)
    expect(calculateHustGrade(6.5, 6.8, 0.4).diemChu).toBe('C+')
    // C (5.5 - 6.4)
    expect(calculateHustGrade(6.0, 6.0, 0.4).diemChu).toBe('C')
    // D+ (5.0 - 5.4)
    expect(calculateHustGrade(5.0, 5.2, 0.4).diemChu).toBe('D+')
    // D (4.0 - 4.9)
    expect(calculateHustGrade(4.5, 4.0, 0.4).diemChu).toBe('D')
  })

  it('xử lý an toàn khi đầu vào ngoài biên (âm hoặc vượt quá 10)', () => {
    const under = calculateHustGrade(-5, -2, 0.4)
    expect(under.diemHpSo).toBe(0)
    expect(under.diemChu).toBe('F')

    const over = calculateHustGrade(15, 12, 0.4)
    expect(over.diemHpSo).toBe(10)
    expect(over.diemChu).toBe('A+')
  })

  it('calculateGradeDetail chuyển đổi đúng 3 đầu điểm thành phần thành diemQt', () => {
    // attendance = 10, midterm = 8, practical = 9
    // 10*0.2 + 8*0.4 + 9*0.4 = 2.0 + 3.2 + 3.6 = 8.8
    const detail = calculateGradeDetail(10, 8, 9, 8.5, 0.4)
    expect(detail.diemQt).toBe(8.8)
    expect(detail.diemCk).toBe(8.5)
    expect(detail.overallScore).toBe(8.6)
  })
})

