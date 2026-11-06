import { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { jwtConfig } from "../config/jwt.config.js";
import { AuthenticatedRequest, AuthClientMeta } from "../types/auth.types.js";
import { sendError, sendSuccess } from "../utils/response.utils.js";

export class AuthController {
  /**
   * Đăng ký: POST /api/v1/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        sendError(res, 400, "Vui lòng nhập đầy đủ username và password");
        return;
      }

      if (username.trim().length < 3) {
        sendError(res, 400, "Tên đăng nhập phải có ít nhất 3 ký tự");
        return;
      }

      if (password.length < 6) {
        sendError(res, 400, "Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }

      const clientMeta: AuthClientMeta = {
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip || req.socket.remoteAddress,
      };

      const result = await authService.register(username.trim(), password, clientMeta);

      // Thiết lập HttpOnly Cookie cho Refresh Token
      res.cookie(jwtConfig.refreshCookieName, result.refreshToken, {
        httpOnly: true,
        secure: jwtConfig.isProduction,
        sameSite: jwtConfig.isProduction ? "strict" : "lax",
        maxAge: jwtConfig.refreshCookieMaxAge,
        path: "/",
      });

      res.status(201).json({
        code: 201,
        message: "Đăng ký tài khoản thành công",
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 15 * 60,
        account: result.account,
      });
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message || "Lỗi máy chủ khi đăng ký tài khoản", err.details);
    }
  }

  /**
   * Đăng nhập: POST /api/v1/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        sendError(res, 400, "Vui lòng nhập đầy đủ username và password");
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
        code: 200,
        message: "Đăng nhập thành công",
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 15 * 60, // 15 phút (giây)
        account: result.account,
      });
    } catch (err: any) {
      sendError(res, err.statusCode || 500, err.message || "Lỗi máy chủ khi đăng nhập", err.details);
    }
  }

  /**
   * Làm mới Access Token: POST /api/v1/auth/refresh
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const rawRefreshToken =
        req.cookies?.[jwtConfig.refreshCookieName] || req.body?.refreshToken;

      if (!rawRefreshToken) {
        sendError(res, 401, "Không tìm thấy Refresh Token hợp lệ");
        return;
      }

      const clientMeta: AuthClientMeta = {
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip || req.socket.remoteAddress,
      };

      const result = await authService.refreshToken(rawRefreshToken, clientMeta);

      // Cập nhật lại Cookie với token mới
      res.cookie(jwtConfig.refreshCookieName, result.refreshToken, {
        httpOnly: true,
        secure: jwtConfig.isProduction,
        sameSite: jwtConfig.isProduction ? "strict" : "lax",
        maxAge: jwtConfig.refreshCookieMaxAge,
        path: "/",
      });

      res.status(200).json({
        code: 200,
        message: "Làm mới Access Token thành công",
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 15 * 60,
        account: result.account,
      });
    } catch (err: any) {
      sendError(res, err.statusCode || 401, err.message || "Làm mới Access Token thất bại", err.details);
    }
  }

  /**
   * Đăng xuất: POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const rawRefreshToken =
        req.cookies?.[jwtConfig.refreshCookieName] || req.body?.refreshToken;

      if (rawRefreshToken) {
        await authService.logout(rawRefreshToken);
      }

      res.clearCookie(jwtConfig.refreshCookieName, {
        httpOnly: true,
        secure: jwtConfig.isProduction,
        sameSite: jwtConfig.isProduction ? "strict" : "lax",
        path: "/",
      });

      sendSuccess(res, null, "Đăng xuất thành công");
    } catch (err: any) {
      sendError(res, 500, err.message || "Lỗi khi đăng xuất", err.details);
    }
  }

  /**
   * Lấy thông tin tài khoản hiện tại: GET /api/v1/auth/me
   */
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.matk) {
        sendError(res, 401, "Chưa xác thực người dùng");
        return;
      }

      const account = await authService.getAccountById(req.user.matk);
      if (!account) {
        sendError(res, 404, "Không tìm thấy thông tin tài khoản");
        return;
      }

      sendSuccess(res, account, "Lấy thông tin tài khoản thành công");
    } catch (err: any) {
      sendError(res, 500, err.message || "Lỗi máy chủ", err.details);
    }
  }
}

export const authController = new AuthController();
