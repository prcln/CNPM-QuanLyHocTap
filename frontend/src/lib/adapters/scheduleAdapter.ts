import type { CourseSchedule, DayOfWeek } from '@/types/student'

export const DAY_NUMBER_TO_DAY_OF_WEEK: Record<number, DayOfWeek> = {
  1: 'Monday',    // standard 1-based (Mon=1) OR Sunday depending on convention
  2: 'Monday',    // Vietnamese Thứ 2
  3: 'Tuesday',   // Thứ 3
  4: 'Wednesday', // Thứ 4
  5: 'Thursday',  // Thứ 5
  6: 'Friday',    // Thứ 6
  7: 'Saturday',  // Thứ 7
  8: 'Sunday',    // Chủ nhật (convention 8)
}

export const DAY_OF_WEEK_TO_VI: Record<DayOfWeek, string> = {
  Monday: 'Thứ Hai',
  Tuesday: 'Thứ Ba',
  Wednesday: 'Thứ Tư',
  Thursday: 'Thứ Năm',
  Friday: 'Thứ Sáu',
  Saturday: 'Thứ Bảy',
  Sunday: 'Chủ Nhật',
}

/**
 * Chuẩn hóa ngày trong tuần từ số hoặc chuỗi sang DayOfWeek
 */
export const normalizeDayOfWeek = (rawDay: unknown): DayOfWeek => {
  if (typeof rawDay === 'number') {
    // 0 is Sunday in JS Date
    if (rawDay === 0) return 'Sunday'
    return DAY_NUMBER_TO_DAY_OF_WEEK[rawDay] || 'Monday'
  }

  if (typeof rawDay === 'string') {
    const trimmed = rawDay.trim().toLowerCase()
    if (trimmed.includes('hai') || trimmed.includes('mon') || trimmed === '2') return 'Monday'
    if (trimmed.includes('ba') || trimmed.includes('tue') || trimmed === '3') return 'Tuesday'
    if (trimmed.includes('tư') || trimmed.includes('tu') || trimmed.includes('wed') || trimmed === '4') return 'Wednesday'
    if (trimmed.includes('năm') || trimmed.includes('nam') || trimmed.includes('thu') || trimmed === '5') return 'Thursday'
    if (trimmed.includes('sáu') || trimmed.includes('sau') || trimmed.includes('fri') || trimmed === '6') return 'Friday'
    if (trimmed.includes('bảy') || trimmed.includes('bay') || trimmed.includes('sat') || trimmed === '7') return 'Saturday'
    if (trimmed.includes('nhật') || trimmed.includes('nhat') || trimmed.includes('sun') || trimmed === '8' || trimmed === 'cn') return 'Sunday'
  }

  return 'Monday'
}

export interface ApiScheduleRaw {
  id?: number | string
  malichhoc?: number
  malh?: number
  class_code?: string
  classCode?: string
  day_of_week?: number
  dayOfWeek?: number
  ngay_trong_tuan?: number
  day_name_vi?: string
  dayNameVi?: string
  start_time?: string
  startTime?: string
  end_time?: string
  endTime?: string
  time_range?: string
  timeRange?: string
  start_period?: string | number
  startPeriod?: string | number
  tiet_bat_dau?: number
  end_period?: string | number
  endPeriod?: string | number
  tiet_ket_thuc?: number
  room?: string
  phong_hoc?: string
  dia_diem?: string
  shift?: string
  weeks_raw?: string
  weeksRaw?: string
  weeks_array?: number[]
  weeksArray?: number[]
}

/**
 * Chuyển đổi một bản ghi lịch học từ API (snake_case hoặc CamelCase) sang CourseSchedule
 */
export const adaptScheduleRawToViewModel = (raw: ApiScheduleRaw): CourseSchedule => {
  const dayRaw = raw.dayOfWeek ?? raw.day_of_week ?? raw.ngay_trong_tuan ?? raw.dayNameVi ?? raw.day_name_vi
  const dayOfWeek = normalizeDayOfWeek(dayRaw)

  let timeSlot = raw.timeRange || raw.time_range || ''
  if (!timeSlot) {
    const start = raw.startTime || raw.start_time
    const end = raw.endTime || raw.end_time
    if (start && end) {
      timeSlot = `${start.slice(0, 5)} - ${end.slice(0, 5)}`
    } else {
      const startP = raw.startPeriod ?? raw.start_period ?? raw.tiet_bat_dau
      const endP = raw.endPeriod ?? raw.end_period ?? raw.tiet_ket_thuc
      if (startP && endP) {
        timeSlot = `Tiết ${startP} - ${endP}`
      } else {
        timeSlot = '07:30 - 09:50'
      }
    }
  }

  const room = raw.room || raw.phong_hoc || raw.dia_diem || 'Chưa xếp phòng'
  const startP = Number(raw.startPeriod ?? raw.start_period ?? raw.tiet_bat_dau) || undefined
  const endP = Number(raw.endPeriod ?? raw.end_period ?? raw.tiet_ket_thuc) || undefined
  const weeks = raw.weeksArray || raw.weeks_array

  return {
    dayOfWeek,
    timeSlot,
    room,
    startPeriod: startP,
    endPeriod: endP,
    weeks,
  }
}

