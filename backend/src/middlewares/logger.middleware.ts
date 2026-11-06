import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();
    const color =
      statusCode >= 500
        ? "\x1b[31m" // red
        : statusCode >= 400
        ? "\x1b[33m" // yellow
        : statusCode >= 300
        ? "\x1b[36m" // cyan
        : "\x1b[32m"; // green
    const reset = "\x1b[0m";

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${color}${statusCode}${reset} - ${duration}ms`
    );
  });

  next();
}

