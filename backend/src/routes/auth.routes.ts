import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const router = Router();

// Public endpoints
router.post(
  "/register",
  validateBody([
    { field: "username", required: true, type: "string", min: 3 },
    { field: "password", required: true, type: "string", min: 6 },
  ]),
  (req, res) => authController.register(req, res)
);

router.post(
  "/login",
  validateBody([
    { field: "username", required: true, type: "string" },
    { field: "password", required: true, type: "string" },
  ]),
  (req, res) => authController.login(req, res)
);

router.post("/refresh", (req, res) => authController.refresh(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));

// Protected endpoint
router.get("/me", authenticateToken, (req, res) => authController.getMe(req, res));

export default router;
