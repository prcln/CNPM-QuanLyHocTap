import { describe, it, expect } from 'vitest'
import {
  adaptCourseRawToViewModel,
  adaptCoursesListResponse,
  adaptGradeRawToViewModel,
  adaptGradesListResponse,
  adaptAssignmentRawToViewModel,
} from '../lib/adapters'
import type { Course } from '../types/student'

describe('Filter Logic Tests', () => {
  const sampleCourses: Course[] = [
    {
      id: '1',
      code: 'IT3080',
      name: 'Mạng Máy Tính',
      instructor: 'TS. Nguyễn Văn A',
      credits: 3,
      semester: '2024.1',
      status: 'active',
      schedule: { dayOfWeek: 'Monday', timeSlot: '06:45 - 09:10', room: 'D9-401' },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      code: 'IT3180',
      name: 'Công Nghệ Phần Mềm',
      instructor: 'TS. Trần Thị B',
      credits: 4,
      semester: '2024.1',
      status: 'active',
      schedule: { dayOfWeek: 'Wednesday', timeSlot: '09:20 - 11:45', room: 'B1-302' },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '3',
      code: 'IT4010',
      name: 'An Toàn Thông Tin',
      instructor: 'PGS. Lê Văn C',
      credits: 3,
      semester: '2024.2',
      status: 'upcoming',
      schedule: { dayOfWeek: 'Friday', timeSlot: '12:30 - 15:00', room: 'D3-201' },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ]

  const filterCourses = (
    list: Course[],
    filter?: { search?: string; status?: string; semester?: string },
  ) => {
    return list.filter((c) => {
      if (filter?.status && filter.status !== 'all' && c.status !== filter.status) {
        return false
      }
      if (filter?.semester && c.semester !== filter.semester) {
        return false
      }
      if (filter?.search) {
        const query = filter.search.toLowerCase()
        const matchCode = c.code.toLowerCase().includes(query)
        const matchName = c.name.toLowerCase().includes(query)
        const matchInstructor = c.instructor.toLowerCase().includes(query)
        if (!matchCode && !matchName && !matchInstructor) return false
      }
      return true
    })
  }

  it('lọc học phần theo từ khóa tìm kiếm (mã môn hoặc tên môn)', () => {
    const result = filterCourses(sampleCourses, { search: 'phần mềm' })
    expect(result).toHaveLength(1)
    expect(result[0].code).toBe('IT3180')

    const codeResult = filterCourses(sampleCourses, { search: 'IT3080' })
    expect(codeResult).toHaveLength(1)
    expect(codeResult[0].name).toBe('Mạng Máy Tính')
  })

  it('lọc học phần theo trạng thái (status = active | upcoming)', () => {
    const activeResult = filterCourses(sampleCourses, { status: 'active' })
    expect(activeResult).toHaveLength(2)

    const upcomingResult = filterCourses(sampleCourses, { status: 'upcoming' })
    expect(upcomingResult).toHaveLength(1)
    expect(upcomingResult[0].code).toBe('IT4010')
  })

  it('lọc học phần theo học kỳ (semester = 2024.1)', () => {
    const semResult = filterCourses(sampleCourses, { semester: '2024.1' })
    expect(semResult).toHaveLength(2)
  })
})

describe('Schema Adapters: Snake_case to View Model Suite', () => {
  it('adaptCourseRawToViewModel chuyển đổi chính xác schema CSDL sang Course ViewModel', () => {
    const rawBackendData = {
      ma_hp: 'IT3180',
      ten_hp: 'Công Nghệ Phần Mềm',
      so_tin_chi: 3,
      ma_lh: 101,
      ten_lh: 'IT3180-01',
      hoc_ky: '2026.1',
      thu: 4,
      tiet_bd: 3,
      tiet_kt: 5,
      phong_hoc: 'D9-401',
      giang_vien: 'TS. Nguyễn Thu Hường',
    }

    const viewModel = adaptCourseRawToViewModel(rawBackendData)

    expect(viewModel.code).toBe('IT3180')
    expect(viewModel.name).toBe('Công Nghệ Phần Mềm')
    expect(viewModel.credits).toBe(3)
    expect(viewModel.semester).toBe('2026.1')
    expect(viewModel.schedule.dayOfWeek).toBe('Wednesday')
    expect(viewModel.schedule.room).toBe('D9-401')
  })

  it('adaptCoursesListResponse xử lý cả dạng mảng trực tiếp và envelope { data: [...] }', () => {
    const rawList = [
      { ma_hp: 'IT1110', ten_hp: 'Tin học đại cương', so_tin_chi: 4 },
      { ma_hp: 'MI1110', ten_hp: 'Giải tích 1', so_tin_chi: 4 },
    ]

    // Dạng mảng
    const list1 = adaptCoursesListResponse(rawList)
    expect(list1).toHaveLength(2)
    expect(list1[0].code).toBe('IT1110')

    // Dạng envelope
    const envelope = { code: 200, message: 'Thành công', data: rawList }
    const list2 = adaptCoursesListResponse(envelope)
    expect(list2).toHaveLength(2)
    expect(list2[1].code).toBe('MI1110')
  })

  it('adaptGradesListResponse xử lý cả dạng mảng trực tiếp và envelope', () => {
    const rawGrades = [
      { mahp: 'IT3080', ten_hp: 'Mạng máy tính', diem_qt: 8, diem_ck: 9 },
      { mahp: 'IT3180', ten_hp: 'CNPM', diem_qt: 9, diem_ck: 8.5 },
    ]
    const list = adaptGradesListResponse({ data: rawGrades })
    expect(list).toHaveLength(2)
    expect(list[0].courseCode).toBe('IT3080')
  })

  it('adaptGradeRawToViewModel chuyển đổi điểm số và tự động tính điểm chữ chuẩn HUST', () => {
    const rawGrade = {
      ma_lh: 105,
      ma_hp: 'IT3080',
      ten_hp: 'Mạng máy tính',
      so_tin_chi: 3,
      diem_qt: '8.5',
      diem_ck: '9.0',
      trongso_qt: '0.4',
    }

    const gradeVm = adaptGradeRawToViewModel(rawGrade)

    expect(gradeVm.courseCode).toBe('IT3080')
    expect(gradeVm.courseName).toBe('Mạng máy tính')
    expect(gradeVm.credits).toBe(3)
    // 8.5 * 0.4 + 9.0 * 0.6 = 3.4 + 5.4 = 8.8 -> A
    expect(gradeVm.overallScore).toBe(8.8)
    expect(gradeVm.letterGrade).toBe('A')
  })

  it('adaptAssignmentRawToViewModel chuyển đổi chính xác bài tập', () => {
    const rawAssignment = {
      ma_bt: 42,
      ma_lh: 101,
      ten_bt: 'Báo cáo Sprint 1',
      mo_ta: 'Tài liệu SRS và Prototype',
      han_nop: '2026-11-20T23:59:59.000Z',
      trang_thai: 'in_progress',
    }

    const assignmentVm = adaptAssignmentRawToViewModel(rawAssignment)

    expect(assignmentVm.id).toBe('42')
    expect(assignmentVm.courseId).toBe('101')
    expect(assignmentVm.title).toBe('Báo cáo Sprint 1')
    expect(assignmentVm.status).toBe('in_progress')
  })
})
