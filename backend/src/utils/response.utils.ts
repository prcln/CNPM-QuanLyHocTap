import { Response } from "express";

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  details?: any;
}

export class AppError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode = 400, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Chuẩn hóa phản hồi thành công theo API Contract
 */
export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message = "Thao tác thành công",
  code = 200,
  pagination?: { total: number; page: number; limit: number; totalPages?: number }
): void {
  const payload: ApiResponse<T> = {
    code,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(pagination
      ? {
          pagination: {
            ...pagination,
            totalPages: pagination.totalPages ?? Math.ceil(pagination.total / (pagination.limit || 1)),
          },
        }
      : {}),
  };
  res.status(code).json(payload);
}

/**
 * Chuẩn hóa phản hồi lỗi { code, message, details } theo API Contract
 */
export function sendError(
  res: Response,
  code = 500,
  message = "Lỗi máy chủ nội bộ",
  details: any = null
): void {
  res.status(code).json({
    code,
    message,
    details: details ?? null,
  });
}

