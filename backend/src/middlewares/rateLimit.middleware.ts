import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.utils.js";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skip?: (req: Request) => boolean;
}

interface ClientRecord {
  timestamps: number[];
}

export function createRateLimiter(options: RateLimitOptions) {
  const {
    windowMs = 15 * 60 * 1000,
    max = 300,
    message = "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.",
    skip,
  } = options;

  const clientStore = new Map<string, ClientRecord>();

  // Cleanup old records every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clientStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        clientStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    if (skip && skip(req)) {
      return next();
    }

    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-client";

    const now = Date.now();
    let record = clientStore.get(clientIp);

    if (!record) {
      record = { timestamps: [] };
      clientStore.set(clientIp, record);
    }

    // Filter out timestamps outside window
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.timestamps.length - 1));
    res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000));

    if (record.timestamps.length >= max) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      sendError(res, 429, message, [
        { field: "rate_limit", message: `Vượt quá giới hạn ${max} yêu cầu mỗi ${Math.round(windowMs / 60000)} phút.` },
      ]);
      return;
    }

    record.timestamps.push(now);
    next();
  };
}

