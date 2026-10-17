import { Router } from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";

const apiV1Router = Router();

apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/accounts", accountRoutes);

export default apiV1Router;
