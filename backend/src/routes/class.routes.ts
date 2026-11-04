import { Router } from "express";
import { classController } from "../controllers/class.controller.js";

const router = Router();

router.get("/", (req, res) => classController.getClasses(req, res));
router.get("/:classCode", (req, res) => classController.getClassByCode(req, res));

export default router;
