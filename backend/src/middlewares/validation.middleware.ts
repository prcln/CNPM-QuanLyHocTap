import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.utils.js";

export interface FieldValidation {
  field: string;
  type?: "string" | "number" | "boolean" | "array" | "object";
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}

/**
 * Middleware kiểm tra và validate body của request
 */
export function validateBody(rules: FieldValidation[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: { field: string; message: string }[] = [];
    const body = req.body || {};

    for (const rule of rules) {
      const val = body[rule.field];

      if (rule.required && (val === undefined || val === null || val === "")) {
        errors.push({
          field: rule.field,
          message: rule.message || `Trường '${rule.field}' là bắt buộc`,
        });
        continue;
      }

      if (val !== undefined && val !== null) {
        if (rule.type) {
          if (rule.type === "array" && !Array.isArray(val)) {
            errors.push({ field: rule.field, message: `Trường '${rule.field}' phải là mảng` });
          } else if (rule.type !== "array" && typeof val !== rule.type) {
            errors.push({ field: rule.field, message: `Trường '${rule.field}' phải có kiểu dữ liệu ${rule.type}` });
          }
        }

        if (typeof val === "string") {
          if (rule.min && val.length < rule.min) {
            errors.push({ field: rule.field, message: `Trường '${rule.field}' phải có ít nhất ${rule.min} ký tự` });
          }
          if (rule.max && val.length > rule.max) {
            errors.push({ field: rule.field, message: `Trường '${rule.field}' không được vượt quá ${rule.max} ký tự` });
          }
          if (rule.pattern && !rule.pattern.test(val)) {
            errors.push({ field: rule.field, message: rule.message || `Trường '${rule.field}' không đúng định dạng` });
          }
        }

        if (typeof val === "number") {
          if (rule.min !== undefined && val < rule.min) {
            errors.push({ field: rule.field, message: `Trường '${rule.field}' phải >= ${rule.min}` });
          }
          if (rule.max !== undefined && val > rule.max) {
            errors.push({ field: rule.field, message: `Trường '${rule.field}' phải <= ${rule.max}` });
          }
        }
      }
    }

    if (errors.length > 0) {
      sendError(res, 400, "Dữ liệu yêu cầu không hợp lệ", errors);
      return;
    }

    next();
  };
}

