import { eq, and, sql, count, ilike, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { classSchedules, viewTkbFull } from "../db/schema.js";

export interface ScheduleQueryFilters {
  classCode?: string;
  dayOfWeek?: number;
  room?: string;
  shift?: string;
  page?: number;
  limit?: number;
}

export interface TimetableQueryFilters {
  semester?: string;
  dayOfWeek?: number;
  room?: string;
  classCode?: string;
  courseId?: string;
  week?: number;
  search?: string;
  limit?: number;
  page?: number;
}

export class ScheduleService {
  /**
   * Truy vấn bảng lịch học class_schedules
   */
  async getSchedules(filters: ScheduleQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (filters.classCode) {
      conditions.push(eq(classSchedules.classCode, filters.classCode));
    }

    if (filters.dayOfWeek !== undefined) {
      conditions.push(eq(classSchedules.dayOfWeek, Number(filters.dayOfWeek)));
    }

    if (filters.room) {
      conditions.push(eq(classSchedules.room, filters.room));
    }

    if (filters.shift) {
      conditions.push(eq(classSchedules.shift, filters.shift));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRecord] = await db
      .select({ total: count() })
      .from(classSchedules)
      .where(whereClause);

    const total = Number(totalRecord?.total || 0);

    const items = await db
      .select()
      .from(classSchedules)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Truy vấn view tổng hợp Thời Khóa Biểu (view_tkb_full)
   */
  async getTimetable(filters: TimetableQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(filters.limit) || 50));
    const offset = (page - 1) * limit;

    const conditions = [];

    // Mặc định lọc theo học kỳ 20261 nếu không truyền
    const semester = filters.semester || "20261";
    conditions.push(eq(viewTkbFull.semester, semester));

    if (filters.dayOfWeek !== undefined) {
      conditions.push(eq(viewTkbFull.dayOfWeek, Number(filters.dayOfWeek)));
    }

    if (filters.room) {
      conditions.push(eq(viewTkbFull.room, filters.room));
    }

    if (filters.classCode) {
      conditions.push(eq(viewTkbFull.classCode, filters.classCode));
    }

    if (filters.courseId) {
      conditions.push(eq(viewTkbFull.courseId, filters.courseId));
    }

    if (filters.search) {
      const keyword = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(viewTkbFull.classCode, keyword),
          ilike(viewTkbFull.courseId, keyword),
          ilike(viewTkbFull.courseNameVi, keyword),
          ilike(viewTkbFull.room, keyword)
        )
      );
    }

    // Lọc theo tuần học cụ thể (sử dụng toán tử ANY trên mảng tuần của Postgres)
    if (filters.week !== undefined) {
      const weekNum = Number(filters.week);
      conditions.push(sql`${weekNum} = ANY(${viewTkbFull.weeksArray})`);
    }

    const whereClause = and(...conditions);

    const [totalRecord] = await db
      .select({ total: count() })
      .from(viewTkbFull)
      .where(whereClause);

    const total = Number(totalRecord?.total || 0);

    const items = await db
      .select()
      .from(viewTkbFull)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const scheduleService = new ScheduleService();
