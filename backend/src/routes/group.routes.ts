import { Router } from "express";
import { assignmentController } from "../controllers/assignment.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:manhom", (req, res) => assignmentController.getGroupById(req, res));
router.put("/:manhom", authenticateToken, (req, res) => assignmentController.updateGroup(req, res));
router.delete("/:manhom", authenticateToken, requireRole("GV", "AD"), (req, res) => assignmentController.deleteGroup(req, res));

// Thành viên nhóm
router.get("/:manhom/members", (req, res) => assignmentController.getGroupMembers(req, res));
router.post("/:manhom/members/:masv", authenticateToken, (req, res) => assignmentController.addMember(req, res));
router.delete("/:manhom/members/:masv", authenticateToken, (req, res) => assignmentController.removeMember(req, res));

export default router;

