// src/types/auth.ts

export type UserRole = 'SV' | 'GV' | 'AD';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export interface AuthUser {
  matk?: number;
  id?: string;
  username: string;
  role?: UserRole;
  fullName?: string;
  studentId?: string; // MSSV (dành cho SV)
  lecturerId?: string; // Mã GV (dành cho GV)
  email?: string;
  faculty?: string;
  avatar?: string;
  token?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export type LoginPayload = LoginCredentials;

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  account: {
    matk: number;
    username: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
  };
}

export class AuthError extends Error {
  field?: 'username' | 'password' | 'email' | 'confirmPassword';

  constructor(
    message: string,
    field?: 'username' | 'password' | 'email' | 'confirmPassword'
  ) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}
