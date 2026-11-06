import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import apiV1Router from "./routes/index.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { isDbConnected } from "./db/index.js";
import { sendSuccess } from "./utils/response.utils.js";

const app = express();

// 1. CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép mọi origin trong môi trường dev / local
      callback(null, true);
    },
    credentials: true,
  })
);

// 2. Request body & cookies parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Request Logging middleware
app.use(requestLogger);

// 4. Healthcheck endpoints (Cả root /health và /api/v1/health)
const healthHandler = async (_req: Request, res: Response) => {
  const dbConnected = await isDbConnected();
  sendSuccess(
    res,
    {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "ready_with_memory_fallback",
      environment: process.env.NODE_ENV || "development",
    },
    "Hệ thống hoạt động bình thường"
  );
};

app.get("/health", healthHandler);
apiV1Router.get("/health", healthHandler);

// 5. Mount toàn bộ API routes dưới /api/v1
app.use("/api/v1", apiV1Router);

// 6. Swagger OpenAPI UI Documentation
// G2: Luôn dùng path.resolve(__dirname, ...) thay vì process.cwd()
const swaggerFilePath =
  process.env.SWAGGER_PATH ||
  path.resolve(__dirname, "../../docs/api_doc_openapi.yaml");

let swaggerDocument = {};
try {
  if (fs.existsSync(swaggerFilePath)) {
    swaggerDocument = yaml.parse(fs.readFileSync(swaggerFilePath, "utf8"));
  } else {
    console.warn(`Swagger documentation file not found at: ${swaggerFilePath}`);
  }
} catch (error) {
  console.error(`Failed to load Swagger document from ${swaggerFilePath}:`, error);
}

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// 7. Not Found middleware (404)
app.use(notFoundHandler);

// 8. Global Error Handler middleware (500, AppError)
app.use(errorHandler);

export default app;
