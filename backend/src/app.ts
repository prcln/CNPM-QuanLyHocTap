import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import apiV1Router from "./routes/index.js";
import { requestLogger, getPerformanceMetrics } from "./middlewares/logger.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { createRateLimiter } from "./middlewares/rateLimit.middleware.js";
import { isDbConnected } from "./db/index.js";
import { sendSuccess } from "./utils/response.utils.js";

const app = express();

// 1. CORS middleware theo môi trường
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !isProduction || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} không được phép truy cập.`));
      }
    },
    credentials: true,
  })
);

// 2. Request body & cookies parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Request Logging & Metrics middleware
app.use(requestLogger);

// 4. Rate Limiter (bảo vệ chống brute-force / DDoS, bỏ qua health & docs)
app.use(
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "test" ? 5000 : 300,
    skip: (req) =>
      req.path === "/health" ||
      req.path === "/api/v1/health" ||
      req.path === "/metrics" ||
      req.path === "/api/v1/metrics" ||
      req.path.startsWith("/api/docs"),
  })
);

// 5. Healthcheck & Metrics endpoints (Cả root và /api/v1)
const healthHandler = async (_req: Request, res: Response) => {
  const dbConnected = await isDbConnected();
  const metrics = getPerformanceMetrics();
  sendSuccess(
    res,
    {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "ready_with_memory_fallback",
      environment: process.env.NODE_ENV || "development",
      nfr01_p95_ms: metrics.p95Ms,
    },
    "Hệ thống hoạt động bình thường"
  );
};

const metricsHandler = (_req: Request, res: Response) => {
  const metrics = getPerformanceMetrics();
  sendSuccess(res, metrics, "Số liệu hiệu năng hệ thống (NFR-01 Metrics)");
};

app.get("/health", healthHandler);
apiV1Router.get("/health", healthHandler);
app.get("/metrics", metricsHandler);
apiV1Router.get("/metrics", metricsHandler);

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
