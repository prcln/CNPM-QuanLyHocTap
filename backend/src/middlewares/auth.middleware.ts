import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import { AuthenticatedRequest, UserRole } from "../types/auth.types.js";

/**
 * Middleware xác thực Bearer Access Token trong Authorization Header
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      code: 401,
      message: "Chưa cung cấp token xác thực (Missing Bearer Token)",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    res.status(401).json({
      code: 401,
      message: "Access Token không hợp lệ hoặc đã hết hạn",
      details: error.message,
    });
    return;
  }
}

/**
 * Middleware phân quyền dựa trên Role (RBAC)
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        code: 401,
        message: "Chưa xác thực người dùng",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        code: 403,
        message: `Quyền truy cập bị từ chối. Yêu cầu một trong các quyền: [${allowedRoles.join(", ")}]`,
      });
      return;
    }

    next();
  };
}
