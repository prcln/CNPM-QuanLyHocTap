import { Router } from "express";
import { courseController } from "../controllers/course.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const router = Router();

// Xem danh sách và chi tiết học phần (Công khai hoặc SV/GV/AD)
router.get("/", (req, res) => courseController.getCourses(req, res));
router.get("/:id", (req, res) => courseController.getCourseById(req, res));

// Quản trị học phần (AD, GV, SV)
router.post(
  "/",
  authenticateToken,
  (req, res, next) => {
    if (!req.body.mahp && req.body.code) req.body.mahp = req.body.code;
    if (!req.body.ten && req.body.name) req.body.ten = req.body.name;
    next();
  },
  validateBody([
    { field: "mahp", required: true, type: "string" },
    { field: "ten", required: true, type: "string" },
  ]),
  (req, res) => courseController.createCourse(req, res)
);
router.put("/:id", authenticateToken, (req, res) => courseController.updateCourse(req, res));
router.delete("/:id", authenticateToken, (req, res) => courseController.deleteCourse(req, res));

export default router;
