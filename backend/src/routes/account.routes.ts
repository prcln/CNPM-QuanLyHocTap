import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Lấy tài khoản hiện tại theo quy ước API Contract (docs/API_contract.md)
router.get("/me", authenticateToken, (req, res) => authController.getMe(req, res));

export default router;
