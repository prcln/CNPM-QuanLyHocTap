import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.utils.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Lỗi máy chủ nội bộ";
  const details = err.details || (process.env.NODE_ENV === "development" ? err.stack : null);

  if (statusCode >= 500) {
    console.error("🔥 Server Error:", err);
  }

  sendError(res, statusCode, message, details);
}

