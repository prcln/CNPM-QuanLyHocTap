import { Router } from "express";
import { assignmentController } from "../controllers/assignment.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// 1. Danh sách tất cả bài tập (hỗ trợ filter ?malh= & ?search=)
router.get("/", (req, res) => assignmentController.getAllAssignments(req, res));

// 2. Tạo bài tập trực tiếp (hỗ trợ truyền malh trong body)
router.post("/:mabt/groups", authenticateToken, (req, res) => assignmentController.createGroup(req, res));
router.post("/", authenticateToken, (req, res) => assignmentController.createAssignment(req, res));

// 3. Bài tập chi tiết & Quản lý
router.get("/:mabt", (req, res) => assignmentController.getAssignmentById(req, res));
router.put("/:mabt", authenticateToken, (req, res) => assignmentController.updateAssignment(req, res));
router.patch("/:mabt/toggle-status", authenticateToken, (req, res) => assignmentController.toggleStatus(req, res));
router.post("/:mabt/toggle-status", authenticateToken, (req, res) => assignmentController.toggleStatus(req, res));
router.delete("/:mabt", authenticateToken, (req, res) => assignmentController.deleteAssignment(req, res));

// 4. Nhóm bài tập
router.get("/:mabt/groups", (req, res) => assignmentController.getGroups(req, res));

export default router;

