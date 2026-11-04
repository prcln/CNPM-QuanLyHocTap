// src/services/auth.ts
// Real API layer cho Đăng nhập / Đăng ký kết nối Backend Express + Supabase

import type { AuthUser, LoginPayload, RegisterPayload, AuthLoginResponse } from "@/types/auth";
import { AuthError } from "@/types/auth";
import { apiClient } from "@/api/client";

export async function loginApi(payload: LoginPayload): Promise<AuthUser> {
  const { username, password } = payload;

  if (!username.trim() || !password.trim()) {
    throw new AuthError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
  }

  try {
    const res = await apiClient.request<AuthLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    apiClient.setToken(res.accessToken);

    return {
      matk: res.account.matk,
      id: String(res.account.matk),
      username: res.account.username,
      role: res.account.role,
      fullName: res.account.username,
      token: res.accessToken,
      createdAt: res.account.createdAt,
    };
  } catch (err: any) {
    const msg = err.message || "Đăng nhập không thành công";
    if (msg.includes("Tài khoản hoặc mật khẩu không chính xác") || msg.includes("không chính xác")) {
      throw new AuthError(msg, "password");
    }
    if (msg.includes("tồn tại")) {
      throw new AuthError(msg, "username");
    }
    throw new AuthError(msg);
  }
}

export async function registerApi(payload: RegisterPayload): Promise<AuthUser> {
  const { username, email, password, confirmPassword } = payload;

  if (!username.trim() || !password.trim()) {
    throw new AuthError("Vui lòng nhập đầy đủ thông tin");
  }

  if (password !== confirmPassword) {
    throw new AuthError("Mật khẩu xác nhận không khớp", "confirmPassword");
  }

  if (password.length < 6) {
    throw new AuthError("Mật khẩu phải có ít nhất 6 ký tự", "password");
  }

  try {
    const res = await apiClient.request<AuthLoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        password,
      }),
    });

    apiClient.setToken(res.accessToken);

    return {
      matk: res.account.matk,
      id: String(res.account.matk),
      username: res.account.username,
      role: res.account.role,
      fullName: res.account.username,
      email: email?.trim(),
      token: res.accessToken,
      createdAt: res.account.createdAt,
    };
  } catch (err: any) {
    const msg = err.message || "Đăng ký không thành công";
    if (msg.includes("đã tồn tại")) {
      throw new AuthError(msg, "username");
    }
    throw new AuthError(msg);
  }
}

// ----- Đồng bộ phiên đăng nhập xác thực -----
const USER_STORAGE_KEY = "cnpm_current_user";

export function saveAuthUser(user: AuthUser) {
  if (user.token) {
    apiClient.setToken(user.token);
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  apiClient.setToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}
