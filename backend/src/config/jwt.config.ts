import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret_change_in_prod",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "default_refresh_secret_change_in_prod",
  accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as string,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as string,
  refreshCookieName: process.env.JWT_REFRESH_COOKIE_NAME || "refreshToken",
  refreshCookieMaxAge: 7 * 24 * 60 * 60 * 1000,
  isProduction: process.env.NODE_ENV === "production",
};
