import { Router } from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";
import courseRoutes from "./course.routes.js";
import classRoutes from "./class.routes.js";
import scheduleRoutes from "./schedule.routes.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/accounts", accountRoutes);
apiV1Router.use("/courses", courseRoutes);
apiV1Router.use("/classes", classRoutes);
apiV1Router.use("/schedules", scheduleRoutes);
apiV1Router.use("/schedule", scheduleRoutes); // alias for backwards compatibility

export default apiV1Router;
