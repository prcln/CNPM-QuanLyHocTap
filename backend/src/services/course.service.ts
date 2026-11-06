import { courseRepository, CourseData } from "../repositories/course.repository.js";

export interface CourseQueryFilters {
  search?: string;
  isOffered?: boolean;
  page?: number;
  limit?: number;
}

export class CourseService {
  async getCourses(filters: CourseQueryFilters = {}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const offset = (page - 1) * limit;

    const res = await courseRepository.findAll({ search: filters.search, limit, offset });
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

  async getCourseById(id: string) {
    return courseRepository.findByMahp(id);
  }

  async createCourse(data: CourseData) {
    return courseRepository.create(data);
  }

  async updateCourse(id: string, data: Partial<CourseData>) {
    return courseRepository.update(id, data);
  }

  async deleteCourse(id: string) {
    return courseRepository.softDelete(id);
  }
}

export const courseService = new CourseService();
