import { eq, ilike, or, and, count } from "drizzle-orm";
import { db } from "../db/index.js";
import { classes, courses, classSchedules } from "../db/schema.js";

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
  /**
   * Truy vấn danh sách lớp học kèm thông tin môn học và phân trang
   */
  async getClasses(filters: ClassQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions = [];

    if (filters.semester) {
      conditions.push(eq(classes.semester, filters.semester));
    }

    if (filters.courseId) {
      conditions.push(eq(classes.courseId, filters.courseId));
    }

    if (filters.departmentCode) {
      conditions.push(eq(classes.departmentCode, filters.departmentCode));
    }

    if (filters.classType) {
      conditions.push(eq(classes.classType, filters.classType));
    }

    if (filters.search) {
      const keyword = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(classes.classCode, keyword),
          ilike(classes.courseId, keyword),
          ilike(courses.nameVi, keyword)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Đếm tổng số bản ghi
    const [totalRecord] = await db
      .select({ total: count() })
      .from(classes)
      .leftJoin(courses, eq(classes.courseId, courses.id))
      .where(whereClause);

    const total = Number(totalRecord?.total || 0);

    // Lấy dữ liệu lớp học kết hợp thông tin môn học
    const items = await db
      .select({
        classCode: classes.classCode,
        semester: classes.semester,
        courseId: classes.courseId,
        courseNameVi: courses.nameVi,
        courseUnits: courses.courseUnits,
        creditCode: courses.creditCode,
        pairedClassCode: classes.pairedClassCode,
        departmentCode: classes.departmentCode,
        classType: classes.classType,
        openBatch: classes.openBatch,
        programCode: classes.programCode,
        status: classes.status,
        maxStudents: classes.maxStudents,
        registeredStudents: classes.registeredStudents,
        needsExperiment: classes.needsExperiment,
        teachingType: classes.teachingType,
        notes: classes.notes,
        createdAt: classes.createdAt,
      })
      .from(classes)
      .leftJoin(courses, eq(classes.courseId, courses.id))
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
   * Lấy chi tiết lớp học kèm lịch học (schedules) và thông tin học phần
   */
  async getClassByCode(classCode: string) {
    const [classData] = await db
      .select({
        classCode: classes.classCode,
        semester: classes.semester,
        courseId: classes.courseId,
        courseNameVi: courses.nameVi,
        courseNameEn: courses.nameEn,
        courseUnits: courses.courseUnits,
        creditCode: courses.creditCode,
        tuitionUnits: courses.tuitionUnits,
        examFactor: courses.examFactor,
        pairedClassCode: classes.pairedClassCode,
        departmentCode: classes.departmentCode,
        classType: classes.classType,
        openBatch: classes.openBatch,
        programCode: classes.programCode,
        status: classes.status,
        maxStudents: classes.maxStudents,
        registeredStudents: classes.registeredStudents,
        needsExperiment: classes.needsExperiment,
        teachingType: classes.teachingType,
        notes: classes.notes,
        warningNote: classes.warningNote,
        createdAt: classes.createdAt,
      })
      .from(classes)
      .leftJoin(courses, eq(classes.courseId, courses.id))
      .where(eq(classes.classCode, classCode))
      .limit(1);

    if (!classData) return null;

    // Lấy các ca học (schedules) của lớp
    const schedules = await db
      .select()
      .from(classSchedules)
      .where(eq(classSchedules.classCode, classCode));

    return {
      ...classData,
      schedules,
    };
  }
}

export const classService = new ClassService();
