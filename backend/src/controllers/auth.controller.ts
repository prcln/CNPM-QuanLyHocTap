import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { jwtConfig } from "../config/jwt.config.js";
import { AuthenticatedRequest, AuthClientMeta } from "../types/auth.types.js";

export class AuthController {
  /**
   * Đăng nhập: POST /api/v1/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          code: 400,
          message: "Vui lòng nhập đầy đủ username và password",
        });
        return;
      }

      const clientMeta: AuthClientMeta = {
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip || req.socket.remoteAddress,
      };

      const result = await authService.login(username, password, clientMeta);

      // Thiết lập HttpOnly Cookie cho Refresh Token
      res.cookie(jwtConfig.refreshCookieName, result.refreshToken, {
        httpOnly: true,
        secure: jwtConfig.isProduction,
        sameSite: jwtConfig.isProduction ? "strict" : "lax",
        maxAge: jwtConfig.refreshCookieMaxAge,
        path: "/",
      });

      res.status(200).json({
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 15 * 60, // 15 phút (giây)
        account: result.account,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        code: statusCode,
        message: err.message || "Lỗi máy chủ khi đăng nhập",
      });
    }
  }

  /**
   * Làm mới Access Token: POST /api/v1/auth/refresh
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Ưu tiên đọc từ HttpOnly Cookie, fallback sang request body
      const refreshToken =
        req.cookies?.[jwtConfig.refreshCookieName] || req.body?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          code: 401,
          message: "Không tìm thấy Refresh Token trong Cookie hoặc Request Body",
        });
        return;
      }

      const clientMeta: AuthClientMeta = {
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip || req.socket.remoteAddress,
      };

      const result = await authService.refreshToken(refreshToken, clientMeta);

      // Cập nhật HttpOnly Cookie với Refresh Token mới (Xoay vòng)
      res.cookie(jwtConfig.refreshCookieName, result.refreshToken, {
        httpOnly: true,
        secure: jwtConfig.isProduction,
        sameSite: jwtConfig.isProduction ? "strict" : "lax",
        maxAge: jwtConfig.refreshCookieMaxAge,
        path: "/",
      });

      res.status(200).json({
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 15 * 60,
        account: result.account,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        code: statusCode,
        message: err.message || "Lỗi khi làm mới token",
      });
    }
  }

  /**
   * Đăng xuất: POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken =
        req.cookies?.[jwtConfig.refreshCookieName] || req.body?.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Xóa Cookie
      res.clearCookie(jwtConfig.refreshCookieName, {
        httpOnly: true,
        secure: jwtConfig.isProduction,
        sameSite: jwtConfig.isProduction ? "strict" : "lax",
        path: "/",
      });

      res.status(200).json({
        code: 200,
        message: "Đăng xuất thành công",
      });
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi đăng xuất",
      });
    }
  }

  /**
   * Lấy tài khoản hiện tại: GET /api/v1/accounts/me hoặc /api/v1/auth/me
   */
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          code: 401,
          message: "Chưa xác thực người dùng",
        });
        return;
      }

      const account = await authService.getAccountById(req.user.matk);
      if (!account) {
        res.status(404).json({
          code: 404,
          message: "Không tìm thấy tài khoản người dùng",
        });
        return;
      }

      res.status(200).json(account);
    } catch (err: any) {
      res.status(500).json({
        code: 500,
        message: err.message || "Lỗi khi lấy thông tin tài khoản",
      });
    }
  }
}

export const authController = new AuthController();
