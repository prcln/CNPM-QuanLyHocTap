import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import apiV1Router from "./routes/index.js";

const app = express();

// Middleware CORS hỗ trợ nhận Cookie từ Frontend Client
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép mọi origin trong môi trường dev / local
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Healthcheck endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Định tuyến API v1
app.use("/api/v1", apiV1Router);

// API Documentation (Swagger)
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

// Xử lý 404 cho các route không tồn tại
app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 404,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    code: status,
    message: err.message || "Lỗi máy chủ nội bộ",
  });
});

export default app;