export type UserRole = 'SV' | 'GV' | 'AD'

export interface AuthUser {
  matk: number
  username: string
  role: UserRole
  fullName: string
  studentId?: string // MSSV (dành cho SV)
  lecturerId?: string // Mã GV (dành cho GV)
  email?: string
  faculty?: string
  avatar?: string
  createdAt?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthLoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  account: {
    matk: number
    username: string
    role: UserRole
    createdAt?: string
    updatedAt?: string
  }
}
