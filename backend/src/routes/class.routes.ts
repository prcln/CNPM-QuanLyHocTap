import { Router } from "express";
import { classController } from "../controllers/class.controller.js";
import { gradeController } from "../controllers/grade.controller.js";
import { scheduleController } from "../controllers/schedule.controller.js";
import { assignmentController } from "../controllers/assignment.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const router = Router();

// 1. Xem lớp học
router.get("/", (req, res) => classController.getClasses(req, res));
router.get("/:malh", (req, res) => classController.getClassById(req, res));

// 2. Quản trị lớp học (AD)
router.post(
  "/",
  authenticateToken,
  requireRole("AD"),
  validateBody([
    { field: "mahp", required: true, type: "string" },
    { field: "malop", required: true, type: "string" },
  ]),
  (req, res) => classController.createClass(req, res)
);
router.put("/:malh", authenticateToken, requireRole("AD"), (req, res) => classController.updateClass(req, res));
router.delete("/:malh", authenticateToken, requireRole("AD"), (req, res) => classController.deleteClass(req, res));

// 3. Quản lý Sinh viên trong lớp
router.get("/:malh/students", authenticateToken, requireRole("GV", "AD"), (req, res) => classController.getStudents(req, res));
router.post("/:malh/students/:masv", authenticateToken, requireRole("AD"), (req, res) => classController.addStudent(req, res));
router.delete("/:malh/students/:masv", authenticateToken, requireRole("AD"), (req, res) => classController.removeStudent(req, res));

// 4. Quản lý Giảng viên trong lớp
router.get("/:malh/lecturers", (req, res) => classController.getLecturers(req, res));
router.post("/:malh/lecturers/:magv", authenticateToken, requireRole("AD"), (req, res) => classController.addLecturer(req, res));
router.delete("/:malh/lecturers/:magv", authenticateToken, requireRole("AD"), (req, res) => classController.removeLecturer(req, res));

// 5. Quản lý Trợ giảng
router.get("/:malh/teaching-assistants", authenticateToken, requireRole("GV", "AD"), (req, res) => classController.getTeachingAssistants(req, res));
router.post("/:malh/teaching-assistants/:masv", authenticateToken, requireRole("AD"), (req, res) => classController.addTeachingAssistant(req, res));
router.delete("/:malh/teaching-assistants/:masv", authenticateToken, requireRole("AD"), (req, res) => classController.removeTeachingAssistant(req, res));

// 6. Điểm số của lớp (Module Điểm)
router.get("/:malh/grades", authenticateToken, requireRole("GV", "AD"), (req, res) => gradeController.getClassGrades(req, res));
router.get("/:malh/grades/:masv", authenticateToken, requireRole("GV", "AD"), (req, res) => gradeController.getStudentGradeInClass(req, res));
router.post("/:malh/grades", authenticateToken, requireRole("GV", "AD"), (req, res) => gradeController.upsertGrade(req, res));
router.put("/:malh/grades/:masv", authenticateToken, requireRole("GV", "AD"), (req, res) => gradeController.upsertGrade(req, res));
router.delete("/:malh/grades/:masv", authenticateToken, requireRole("AD"), (req, res) => gradeController.deleteGrade(req, res));

// 7. Lịch học của lớp (Module Lịch học)
router.get("/:malh/schedule", (req, res) => scheduleController.getClassSchedule(req, res));
router.post("/:malh/schedule", authenticateToken, requireRole("AD"), (req, res) => scheduleController.createSchedule(req, res));

// 8. Bài tập của lớp (Module Bài tập)
router.get("/:malh/assignments", (req, res) => assignmentController.getAssignmentsByClass(req, res));
router.post(
  "/:malh/assignments",
  authenticateToken,
  requireRole("GV", "AD"),
  validateBody([{ field: "loai", required: false, type: "string" }]),
  (req, res) => assignmentController.createAssignment(req, res)
);

export default router;
