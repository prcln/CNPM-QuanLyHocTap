import { eq, and, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { taiKhoan, refreshTokens } from "../db/schema.js";
import { comparePassword } from "../utils/password.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../utils/jwt.utils.js";
import { jwtConfig } from "../config/jwt.config.js";
import {
  AuthClientMeta,
  AccountDto,
  JwtUserPayload,
} from "../types/auth.types.js";

export class AuthService {
  /**
   * Đăng nhập với username và password
   */
  async login(
    username: string,
    pass: string,
    clientMeta: AuthClientMeta
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    account: AccountDto;
  }> {
    // 1. Tìm tài khoản còn hoạt động (chưa bị xóa mềm)
    const [user] = await db
      .select()
      .from(taiKhoan)
      .where(and(eq(taiKhoan.username, username), isNull(taiKhoan.deletedAt)))
      .limit(1);

    if (!user) {
      const error: any = new Error("Tài khoản hoặc mật khẩu không chính xác");
      error.statusCode = 401;
      throw error;
    }

    // 2. Đối soát mật khẩu
    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) {
      const error: any = new Error("Tài khoản hoặc mật khẩu không chính xác");
      error.statusCode = 401;
      throw error;
    }

    // 3. Tạo Payload
    const payload: JwtUserPayload = {
      matk: user.matk,
      username: user.username,
      role: user.role,
    };

    // 4. Sinh cặp Access Token & Refresh Token
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 5. Lưu Refresh Token đã băm vào Database
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + jwtConfig.refreshCookieMaxAge);

    await db.insert(refreshTokens).values({
      matk: user.matk,
      tokenHash,
      expiresAt,
      userAgent: clientMeta.userAgent,
      ipAddress: clientMeta.ipAddress,
    });

    const account: AccountDto = {
      matk: user.matk,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { accessToken, refreshToken, account };
  }

  /**
   * Xoay vòng Refresh Token (Token Rotation & Reuse Detection)
   */
  async refreshToken(
    rawRefreshToken: string,
    clientMeta: AuthClientMeta
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    account: AccountDto;
  }> {
    if (!rawRefreshToken) {
      const error: any = new Error("Không tìm thấy Refresh Token");
      error.statusCode = 401;
      throw error;
    }

    // 1. Giải mã token JWT
    let payload: JwtUserPayload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      const error: any = new Error("Refresh Token không hợp lệ hoặc đã hết hạn");
      error.statusCode = 401;
      throw error;
    }

    // 2. Tra cứu token trong DB
    const tokenHash = hashToken(rawRefreshToken);
    const [existingToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);

    if (!existingToken) {
      const error: any = new Error("Refresh Token không tồn tại");
      error.statusCode = 403;
      throw error;
    }

    // 3. PHÁT HIỆN TÁI SỬ DỤNG (Reuse Detection): Nếu token đã bị thu hồi trước đó
    if (existingToken.revokedAt !== null) {
      // Vô hiệu hóa toàn bộ tokens thuộc tài khoản này vì nghi ngờ bị đánh cắp token
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.matk, existingToken.matk));

      const error: any = new Error(
        "Phát hiện hành vi tái sử dụng Refresh Token. Toàn bộ phiên đăng nhập đã bị vô hiệu hóa vì lý do bảo mật."
      );
      error.statusCode = 403;
      throw error;
    }

    // 4. Kiểm tra thời hạn lưu trữ trong DB
    if (new Date(existingToken.expiresAt) < new Date()) {
      const error: any = new Error("Refresh Token đã hết hạn, vui lòng đăng nhập lại");
      error.statusCode = 401;
      throw error;
    }

    // 5. Kiểm tra tài khoản người dùng
    const [user] = await db
      .select()
      .from(taiKhoan)
      .where(and(eq(taiKhoan.matk, existingToken.matk), isNull(taiKhoan.deletedAt)))
      .limit(1);

    if (!user) {
      const error: any = new Error("Tài khoản người dùng không tồn tại hoặc đã bị khóa");
      error.statusCode = 401;
      throw error;
    }

    // 6. Thu hồi token cũ (Revoke Old Token)
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, existingToken.id));

    // 7. Cấp cặp token mới
    const newPayload: JwtUserPayload = {
      matk: user.matk,
      username: user.username,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    // 8. Lưu token mới vào DB
    const newTokenHash = hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + jwtConfig.refreshCookieMaxAge);

    await db.insert(refreshTokens).values({
      matk: user.matk,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
      userAgent: clientMeta.userAgent,
      ipAddress: clientMeta.ipAddress,
    });

    const account: AccountDto = {
      matk: user.matk,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      account,
    };
  }

  /**
   * Đăng xuất và thu hồi Refresh Token
   */
  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;

    try {
      const tokenHash = hashToken(rawRefreshToken);
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.tokenHash, tokenHash));
    } catch (err) {
      console.warn("Lỗi khi thu hồi refresh token:", err);
    }
  }

  /**
   * Lấy thông tin tài khoản theo ID
   */
  async getAccountById(matk: number): Promise<AccountDto | null> {
    const [user] = await db
      .select()
      .from(taiKhoan)
      .where(and(eq(taiKhoan.matk, matk), isNull(taiKhoan.deletedAt)))
      .limit(1);

    if (!user) return null;

    return {
      matk: user.matk,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();
