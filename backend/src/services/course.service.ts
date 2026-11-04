import { eq, ilike, or, and, sql, count } from "drizzle-orm";
import { db } from "../db/index.js";
import { courses, classes } from "../db/schema.js";

export interface CourseQueryFilters {
  search?: string;
  isOffered?: boolean;
  page?: number;
  limit?: number;
}

export class CourseService {
  /**
   * Truy vấn danh sách học phần (courses) kèm phân trang và tìm kiếm
   */
  async getCourses(filters: CourseQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (filters.search) {
      const keyword = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(courses.id, keyword),
          ilike(courses.nameVi, keyword),
          ilike(courses.nameEn, keyword)
        )
      );
    }

    if (filters.isOffered !== undefined) {
      conditions.push(eq(courses.isOffered20261, Boolean(filters.isOffered)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Đếm tổng số bản ghi
    const [totalRecord] = await db
      .select({ total: count() })
      .from(courses)
      .where(whereClause);

    const total = Number(totalRecord?.total || 0);

    // Lấy danh sách kết quả
    const items = await db
      .select()
      .from(courses)
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
   * Lấy chi tiết một học phần kèm danh sách các lớp học liên quan
   */
  async getCourseById(id: string) {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!course) return null;

    // Lấy các lớp học mở cho học phần này
    const classList = await db
      .select()
      .from(classes)
      .where(eq(classes.courseId, id));

    return {
      ...course,
      classes: classList,
    };
  }
}

export const courseService = new CourseService();
