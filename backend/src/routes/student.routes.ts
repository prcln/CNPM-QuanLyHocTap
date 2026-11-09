import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { gradeController } from "../controllers/grade.controller.js";
import { scheduleController } from "../controllers/schedule.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// 1. Endpoints cho Sinh viên hiện tại (/students/me/*)
router.get("/me", authenticateToken, requireRole("SV"), (req, res) => studentController.getMe(req, res));
router.put("/me", authenticateToken, requireRole("SV"), (req, res) => studentController.updateMe(req, res));
router.get("/me/grades", authenticateToken, requireRole("SV"), (req, res) => gradeController.getMyGrades(req, res));
router.get("/me/grades/:malh", authenticateToken, requireRole("SV"), (req, res) => gradeController.getMyGradeInClass(req, res));
router.put("/me/grades/:malh", authenticateToken, requireRole("SV"), (req, res) => gradeController.upsertMyGradeInClass(req, res));
router.post("/me/grades/:malh", authenticateToken, requireRole("SV"), (req, res) => gradeController.upsertMyGradeInClass(req, res));
router.get("/me/gpa", authenticateToken, requireRole("SV"), (req, res) => studentController.getGpa(req, res));
router.get("/me/cpa", authenticateToken, requireRole("SV"), (req, res) => studentController.getCpa(req, res));
router.get("/me/schedule", authenticateToken, requireRole("SV"), (req, res) => scheduleController.getMySchedule(req, res));
router.get("/me/classes", authenticateToken, requireRole("SV"), (req, res) => studentController.getMyClasses(req, res));
router.post("/me/classes/:malh", authenticateToken, requireRole("SV"), (req, res) => studentController.registerClass(req, res));
router.delete("/me/classes/:malh", authenticateToken, requireRole("SV"), (req, res) => studentController.unregisterClass(req, res));

// 2. Endpoints quản lý sinh viên (GV/AD)
router.get("/", authenticateToken, requireRole("GV", "AD"), (req, res) => studentController.getStudents(req, res));
router.get("/:masv", authenticateToken, requireRole("GV", "AD"), (req, res) => studentController.getStudentByMasv(req, res));
router.get("/:masv/grades", authenticateToken, requireRole("GV", "AD"), (req, res) => gradeController.getStudentGrades(req, res));
router.get("/:masv/schedule", authenticateToken, requireRole("GV", "AD"), (req, res) => scheduleController.getStudentSchedule(req, res));

// 3. Quản trị viên (AD) CRUD
router.post("/", authenticateToken, requireRole("AD"), (req, res) => studentController.createStudent(req, res));
router.put("/:masv", authenticateToken, requireRole("AD"), (req, res) => studentController.updateStudent(req, res));
router.delete("/:masv", authenticateToken, requireRole("AD"), (req, res) => studentController.deleteStudent(req, res));

export default router;

