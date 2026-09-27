export type CourseStatus = 'active' | 'upcoming' | 'completed'

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface CourseSchedule {
  dayOfWeek: DayOfWeek
  timeSlot: string // e.g., "07:30 - 09:50" or "13:30 - 15:50"
  room: string     // e.g., "B1.04", "C302", "Lab 4"
}

export interface Course {
  id: string
  code: string
  name: string
  instructor: string
  credits: number
  semester: string // e.g., "HK2 2025-2026"
  status: CourseStatus
  schedule: CourseSchedule
  colorTag?: string // Hex or color name for UI badges
  description?: string
  createdAt: string
  updatedAt: string
}

export type AssignmentPriority = 'low' | 'medium' | 'high'
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed'

export interface Assignment {
  id: string
  courseId: string
  title: string
  description?: string
  dueDate: string // ISO string "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
  priority: AssignmentPriority
  status: AssignmentStatus
  estimatedHours?: number
  createdAt: string
}

export interface GradeRecord {
  id: string
  courseId: string
  attendanceScore: number  // Chuyên cần (10%)
  midtermScore: number     // Giữa kỳ (20% - 30%)
  practicalScore: number   // Thực hành / Bài tập lớn (20%)
  finalExamScore: number   // Cuối kỳ (40% - 50%)
  overallScore: number     // Điểm tổng kết hệ 10
  gpaScore: number         // Điểm hệ 4
  letterGrade: string      // A+, A, B+, B, C, D, F
}

export interface CourseFilters {
  search?: string
  status?: CourseStatus | 'all'
  semester?: string
}

export interface AssignmentFilters {
  courseId?: string | 'all'
  status?: AssignmentStatus | 'all'
  priority?: AssignmentPriority | 'all'
  search?: string
}

export interface StudyStats {
  totalCourses: number
  activeCourses: number
  totalCredits: number
  completedCredits: number
  overallGpa10: number
  overallGpa4: number
  totalAssignments: number
  pendingAssignments: number
  completedAssignments: number
  urgentDeadlinesCount: number // Hạn nộp trong vòng 3 ngày tới
}

export type ActivityCategory =
  | 'academic'     // Học thuật, NCKH, Hackathon
  | 'volunteer'    // Tình nguyện, Hiến máu
  | 'career'       // Ngày hội việc làm, Tuyển dụng, Doanh nghiệp
  | 'sports_arts'  // Văn nghệ, Thể thao, Giải đấu
  | 'community'    // Hoạt động Đoàn, Hội, Cộng đồng

export interface ExtracurricularActivity {
  id: string
  title: string
  organizer: string
  category: ActivityCategory
  drlPoints: number
  drlCriterion: string // e.g. "Tiêu chí 3: Hoạt động phong trào"
  date: string        // YYYY-MM-DD
  time: string        // e.g. "08:00 - 11:30"
  location: string    // e.g. "Hội trường C2", "Thư viện Tạ Quang Bửu"
  registered: boolean
  attended: boolean
  maxParticipants?: number
  registeredCount: number
  description: string
  imageUrl?: string
  tags?: string[]
}

export interface DrlCriteriaScore {
  criterionId: number
  name: string
  maxScore: number
  currentScore: number
}

export interface DrlSummary {
  totalDrl: number
  rank: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu' | 'Kém'
  nextRankTarget: number
  criteriaBreakdown: DrlCriteriaScore[]
}

