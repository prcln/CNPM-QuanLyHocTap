import { Router } from "express";
import { activityController } from "../controllers/activity.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Hỗ trợ cả sinh viên đã đăng nhập và guest xem danh sách
router.get("/", (req, res) => activityController.getActivities(req, res));
router.get("/drl-summary", (req, res) => activityController.getDrlSummary(req, res));

// Đăng ký / Hủy đăng ký hoạt động
router.post("/:id/toggle", (req, res) => activityController.toggleRegister(req, res));
router.post("/:id/register", (req, res) => activityController.toggleRegister(req, res));

export default router;

