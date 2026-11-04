import { Router } from "express";
import { scheduleController } from "../controllers/schedule.controller.js";

const router = Router();

router.get("/timetable", (req, res) => scheduleController.getTimetable(req, res));
router.get("/", (req, res) => scheduleController.getSchedules(req, res));

export default router;
