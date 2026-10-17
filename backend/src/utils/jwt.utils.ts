import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { jwtConfig } from "../config/jwt.config.js";
import { JwtUserPayload } from "../types/auth.types.js";

/**
 * Sinh Access Token (ngắn hạn, mặc định 15 phút)
 */
export function generateAccessToken(payload: JwtUserPayload): string {
  const options: SignOptions = {
    expiresIn: jwtConfig.accessExpiresIn as unknown as number, // jsonwebtoken accepts string like '15m'
  };
  return jwt.sign(payload, jwtConfig.accessSecret, options);
}

/**
 * Sinh Refresh Token (dài hạn, mặc định 7 ngày)
 */
export function generateRefreshToken(payload: JwtUserPayload): string {
  const options: SignOptions = {
    expiresIn: jwtConfig.refreshExpiresIn as unknown as number, // jsonwebtoken accepts string like '7d'
  };
  return jwt.sign(payload, jwtConfig.refreshSecret, options);
}

/**
 * Xác minh tính hợp lệ của Access Token
 */
export function verifyAccessToken(token: string): JwtUserPayload {
  return jwt.verify(token, jwtConfig.accessSecret) as JwtUserPayload;
}

/**
 * Xác minh tính hợp lệ của Refresh Token
 */
export function verifyRefreshToken(token: string): JwtUserPayload {
  return jwt.verify(token, jwtConfig.refreshSecret) as JwtUserPayload;
}

/**
 * Băm Refresh Token bằng SHA-256 để lưu trữ an toàn trong DB và tra cứu nhanh
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
