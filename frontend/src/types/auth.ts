// src/types/auth.ts
// Định nghĩa các kiểu dữ liệu dùng chung cho module Đăng nhập / Đăng ký

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // chỉ tồn tại trong mock, backend thật sẽ không bao giờ trả password về client
}

// Dữ liệu client gửi lên khi đăng nhập
export interface LoginPayload {
  username: string;
  password: string;
}

// Dữ liệu client gửi lên khi đăng ký
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Dữ liệu server trả về sau khi login/register thành công
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  token: string; // token giả lập, sẽ được thay bằng JWT thật khi có backend
}

// Kiểu lỗi thống nhất để hiển thị message trên form
export class AuthError extends Error {
  field?: "username" | "password" | "email" | "confirmPassword";

  constructor(
    message: string,
    field?: "username" | "password" | "email" | "confirmPassword",
  ) {
    super(message);
    this.name = "AuthError";
    this.field = field;
  }
}
