import { Router } from "express";
import { assignmentController } from "../controllers/assignment.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Bài tập chi tiết
router.get("/:mabt", (req, res) => assignmentController.getAssignmentById(req, res));
router.put("/:mabt", authenticateToken, requireRole("GV", "AD"), (req, res) => assignmentController.updateAssignment(req, res));
router.delete("/:mabt", authenticateToken, requireRole("GV", "AD"), (req, res) => assignmentController.deleteAssignment(req, res));

// Nhóm bài tập
router.get("/:mabt/groups", (req, res) => assignmentController.getGroups(req, res));
router.post("/:mabt/groups", authenticateToken, (req, res) => assignmentController.createGroup(req, res));

export default router;

