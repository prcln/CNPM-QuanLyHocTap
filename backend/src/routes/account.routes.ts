import { Router } from "express";
import { accountController } from "../controllers/account.controller.js";
import { authenticateToken, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const router = Router();

// Lấy thông tin tài khoản hiện tại
router.get("/me", authenticateToken, (req, res) => accountController.getMe(req, res));

// Các route quản trị tài khoản (AD)
router.get("/", authenticateToken, requireRole("AD"), (req, res) => accountController.getAccounts(req, res));
router.get("/:matk", authenticateToken, requireRole("AD"), (req, res) => accountController.getAccountById(req, res));
router.post(
  "/",
  authenticateToken,
  requireRole("AD"),
  validateBody([
    { field: "username", required: true, type: "string", min: 3 },
    { field: "password", required: true, type: "string", min: 6 },
  ]),
  (req, res) => accountController.createAccount(req, res)
);
router.put("/:matk", authenticateToken, requireRole("AD"), (req, res) => accountController.updateAccount(req, res));
router.delete("/:matk", authenticateToken, requireRole("AD"), (req, res) => accountController.deleteAccount(req, res));

export default router;
