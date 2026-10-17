import { Request } from "express";

export type UserRole = "SV" | "GV" | "AD";

export interface JwtUserPayload {
  matk: number;
  username: string;
  role: string;
}

export interface AuthClientMeta {
  userAgent?: string;
  ipAddress?: string;
}

export interface AccountDto {
  matk: number;
  username: string;
  role: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number; // in seconds
  account: AccountDto;
}

// Extend Express Request type
export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}
