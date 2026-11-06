import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/timetable", (req, res) => scheduleController.getTimetable(req, res));
router.get("/", (req, res) => scheduleController.getSchedules(req, res));
router.get("/:malichhoc", (req, res) => scheduleController.getScheduleById(req, res));
router.put("/:malichhoc", authenticateToken, requireRole("AD"), (req, res) => scheduleController.updateSchedule(req, res));
router.delete("/:malichhoc", authenticateToken, requireRole("AD"), (req, res) => scheduleController.deleteSchedule(req, res));

export default router;
