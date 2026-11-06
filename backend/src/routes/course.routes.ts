import { Router } from "express";
import { courseController } from "../controllers/course.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const router = Router();

// Xem danh sách và chi tiết học phần (Công khai hoặc SV/GV/AD)
router.get("/", (req, res) => courseController.getCourses(req, res));
router.get("/:id", (req, res) => courseController.getCourseById(req, res));

// Quản trị học phần (AD)
router.post(
  "/",
  authenticateToken,
  requireRole("AD"),
  validateBody([
    { field: "mahp", required: true, type: "string" },
    { field: "ten", required: true, type: "string" },
  ]),
  (req, res) => courseController.createCourse(req, res)
);
router.put("/:id", authenticateToken, requireRole("AD"), (req, res) => courseController.updateCourse(req, res));
router.delete("/:id", authenticateToken, requireRole("AD"), (req, res) => courseController.deleteCourse(req, res));

export default router;
