import { Router } from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";
import studentRoutes from "./student.routes.js";
import lecturerRoutes from "./lecturer.routes.js";
import courseRoutes from "./course.routes.js";
import classRoutes from "./class.routes.js";
import scheduleRoutes from "./schedule.routes.js";
import assignmentRoutes from "./assignment.routes.js";
import groupRoutes from "./group.routes.js";
import activityRoutes from "./activity.routes.js";

const apiV1Router = Router();

// 1. Module Tài khoản
apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/accounts", accountRoutes);

// 2. Module Sinh viên
apiV1Router.use("/students", studentRoutes);

// 3. Module Giảng viên
apiV1Router.use("/lecturers", lecturerRoutes);

// 4. Module Học phần
apiV1Router.use("/courses", courseRoutes);

// 5. Module Lớp học (Bao gồm điểm lớp, sinh viên lớp, giảng viên lớp, lịch học lớp, bài tập lớp)
apiV1Router.use("/classes", classRoutes);

// 6. Module Lịch học
apiV1Router.use("/schedules", scheduleRoutes);
apiV1Router.use("/schedule", scheduleRoutes); // alias theo API Contract

// 7. Module Bài tập & Nhóm
apiV1Router.use("/assignments", assignmentRoutes);
apiV1Router.use("/groups", groupRoutes);

// 8. Module Hoạt động ngoại khóa & DRL
apiV1Router.use("/activities", activityRoutes);

export default apiV1Router;
