// src/types/auth.ts
// Định nghĩa các kiểu dữ liệu dùng chung cho module Đăng nhập / Đăng ký
import { z } from "zod";
import type { ITaiKhoan } from "./dbSchema";
export const LoginFormValuesSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginFormValuesType = z.infer<typeof LoginFormValuesSchema>;

export const RegisterFormValuesSchema = z
  .object({
    username: z.string().min(3, "Tên đăng nhập cần ít nhất 3 ký tự"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormValuesType = z.infer<typeof RegisterFormValuesSchema>;

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // chỉ tồn tại trong mock, backend thật sẽ không bao giờ trả password về client
}

// Dữ liệu client gửi lên khi đăng nhập
export type LoginPayload = Pick<
  ITaiKhoan,
  "username" | "password"
>;

export type AccountResponse = Pick<
  ITaiKhoan,
  "matk" | "username" | "role"
> & {
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  deleted_by?: number | null;
};

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  account: AccountResponse;
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
