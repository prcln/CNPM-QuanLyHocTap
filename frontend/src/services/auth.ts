// src/services/auth.ts
// Mock API layer cho Đăng nhập / Đăng ký.
// Khi backend thật (hoặc MSW từ issue #5) sẵn sàng, chỉ cần thay nội dung
// bên trong 2 hàm loginApi() và registerApi() bằng fetch()/axios thật —
// phần gọi hàm ở component (login-form.tsx, register-form.tsx) không cần đổi.

import type { AuthUser, LoginPayload, RegisterPayload, User } from "@/types/auth";
import { AuthError } from "@/types/auth";

// ----- "Database" giả lập trong bộ nhớ -----
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "123456",
  },
];

// Giả lập độ trễ mạng để giao diện loading trông giống thật
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sinh token giả lập — KHÔNG dùng cách này khi có backend thật
function fakeToken(username: string) {
  return btoa(`${username}:${Date.now()}`);
}

export async function loginApi(payload: LoginPayload): Promise<AuthUser> {
  await delay(600);

  const { username, password } = payload;

  if (!username.trim() || !password.trim()) {
    throw new AuthError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
  }

  const user = mockUsers.find((u) => u.username === username);

  if (!user) {
    throw new AuthError("Tài khoản không tồn tại", "username");
  }

  if (user.password !== password) {
    throw new AuthError("Mật khẩu không đúng", "password");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    token: fakeToken(user.username),
  };
}

export async function registerApi(payload: RegisterPayload): Promise<AuthUser> {
  await delay(600);

  const { username, email, password, confirmPassword } = payload;

  if (!username.trim() || !email.trim() || !password.trim()) {
    throw new AuthError("Vui lòng nhập đầy đủ thông tin");
  }

  if (password !== confirmPassword) {
    throw new AuthError("Mật khẩu xác nhận không khớp", "confirmPassword");
  }

  if (password.length < 6) {
    throw new AuthError("Mật khẩu phải có ít nhất 6 ký tự", "password");
  }

  const existed = mockUsers.some((u) => u.username === username);
  if (existed) {
    throw new AuthError("Tên đăng nhập đã tồn tại", "username");
  }

  const newUser: User = {
    id: String(mockUsers.length + 1),
    username,
    email,
    password,
  };
  mockUsers.push(newUser);

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    token: fakeToken(newUser.username),
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
