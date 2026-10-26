// src/services/auth.ts
// Mock API layer cho Đăng nhập / Đăng ký.
// Khi backend thật (hoặc MSW từ issue #5) sẵn sàng, chỉ cần thay nội dung
// bên trong 2 hàm loginApi() và registerApi() bằng fetch()/axios thật —
// phần gọi hàm ở component (login-form.tsx, register-form.tsx) không cần đổi.
import { mockUsers } from "@/utils/mockData";

import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import {
  mockLoginRequest,
  mockRegisterRequest,
} from "@/utils/mockAuthServer";

export async function loginApi(
  payload: LoginPayload
): Promise<AuthUser> {
  const response = await mockLoginRequest(payload);

  return {
    id: String(response.account.matk),
    username: response.account.username,
    email: mockUsers.find(
      (user) => user.username === response.account.username
    )?.email ?? "",
    token: response.access_token,
  };
}

export async function registerApi(
  payload: RegisterPayload
): Promise<AuthUser> {
  const response = await mockRegisterRequest(payload);

  return {
    id: String(response.account.matk),
    username: response.account.username,
    email: payload.email,
    token: response.access_token,
  };
}


// ----- Lưu / đọc phiên đăng nhập tạm thời -----
const STORAGE_KEY = "auth_user";

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearAuthUser() {
  localStorage.removeItem(STORAGE_KEY);
}
