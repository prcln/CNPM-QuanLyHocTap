import { Router } from "express";
import { courseController } from "../controllers/course.controller.js";

const router = Router();

router.get("/", (req, res) => courseController.getCourses(req, res));
router.get("/:id", (req, res) => courseController.getCourseById(req, res));

export default router;
