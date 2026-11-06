import { Router } from "express";
import { lecturerController } from "../controllers/lecturer.controller.js";
import { scheduleController } from "../controllers/schedule.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// 1. Giảng viên hiện tại (/lecturers/me/*)
router.get("/me", authenticateToken, requireRole("GV"), (req, res) => lecturerController.getMe(req, res));
router.put("/me", authenticateToken, requireRole("GV"), (req, res) => lecturerController.updateMe(req, res));
router.get("/me/classes", authenticateToken, requireRole("GV"), (req, res) => lecturerController.getMyClasses(req, res));
router.get("/me/schedule", authenticateToken, requireRole("GV"), (req, res) => scheduleController.getMySchedule(req, res));

// 2. Quản trị giảng viên (AD)
router.get("/", authenticateToken, requireRole("AD"), (req, res) => lecturerController.getLecturers(req, res));
router.get("/:magv", authenticateToken, requireRole("AD"), (req, res) => lecturerController.getLecturerByMagv(req, res));
router.get("/:magv/classes", authenticateToken, requireRole("GV", "AD"), (req, res) => lecturerController.getClassesByMagv(req, res));
router.get("/:magv/schedule", authenticateToken, requireRole("AD"), (req, res) => scheduleController.getLecturerSchedule(req, res));
router.post("/", authenticateToken, requireRole("AD"), (req, res) => lecturerController.createLecturer(req, res));
router.put("/:magv", authenticateToken, requireRole("AD"), (req, res) => lecturerController.updateLecturer(req, res));
router.delete("/:magv", authenticateToken, requireRole("AD"), (req, res) => lecturerController.deleteLecturer(req, res));

export default router;

