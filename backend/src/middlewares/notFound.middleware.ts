import { Request, Response } from "express";
import { sendError } from "../utils/response.utils.js";

export function notFoundHandler(req: Request, res: Response): void {
  sendError(
    res,
    404,
    `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
    { path: req.originalUrl, method: req.method }
  );
}

