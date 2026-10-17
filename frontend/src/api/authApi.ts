import { apiClient } from './client'
import { sleep } from './mockDb'
import type { AuthUser, LoginCredentials, AuthLoginResponse } from '@/types/auth'

export interface DemoAccount {
  username: string
  password: string
  role: 'SV' | 'GV' | 'AD'
  roleLabel: string
  fullName: string
  badgeColor: string
  subtitle: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'sv_20210001',
    password: '123456',
    role: 'SV',
    roleLabel: 'Sinh Viên',
    fullName: 'Nguyễn Văn An',
    badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-800',
    subtitle: 'MSSV: 20210001 • K66 - CNPM 01',
  },
  {
    username: 'gv_huong',
    password: '123456',
    role: 'GV',
    roleLabel: 'Giảng Viên',
    fullName: 'TS. Nguyễn Thu Hường',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    subtitle: 'Mã GV: GV082 • BM Công Nghệ Phần Mềm',
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'AD',
    roleLabel: 'Quản Trị Viên',
    fullName: 'Quản Trị Viên Hệ Thống',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800',
    subtitle: 'Root Admin • Toàn quyền hệ thống',
  },
]

const MOCK_PROFILES: Record<string, Partial<AuthUser>> = {
  sv_20210001: {
    fullName: 'Nguyễn Văn An',
    studentId: '20210001',
    email: 'an.nv210001@sis.hust.edu.vn',
    faculty: 'Trường Công Nghệ Thông Tin & Truyền Thông',
  },
  gv_huong: {
    fullName: 'TS. Nguyễn Thu Hường',
    lecturerId: 'GV082',
    email: 'huong.nt@soict.hust.edu.vn',
    faculty: 'Bộ môn Công Nghệ Phần Mềm - SOICT',
  },
  admin: {
    fullName: 'Quản Trị Viên Hệ Thống',
    email: 'admin@hust.edu.vn',
    faculty: 'Phòng Đào Tạo & CNTT',
  },
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; accessToken: string }> => {
    const isBackend = apiClient.getMode() === 'backend'

    if (isBackend) {
      try {
        const response = await apiClient.request<AuthLoginResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: credentials.username.trim(),
            password: credentials.password,
          }),
        })

        const account = response.account
        const extraProfile = MOCK_PROFILES[account.username] || {}

        const user: AuthUser = {
          matk: account.matk,
          username: account.username,
          role: account.role,
          fullName: extraProfile.fullName || (account.username === 'admin' ? 'Quản Trị Viên' : account.username),
          studentId: extraProfile.studentId || (account.role === 'SV' ? '20210001' : undefined),
          lecturerId: extraProfile.lecturerId || (account.role === 'GV' ? 'GV082' : undefined),
          email: extraProfile.email || `${account.username}@hust.edu.vn`,
          faculty: extraProfile.faculty || 'Trường Công Nghệ Thông Tin & Truyền Thông',
          createdAt: account.createdAt,
        }

        apiClient.setToken(response.accessToken)
        return { user, accessToken: response.accessToken }
      } catch (err: any) {
        // If error is 401/400, throw actual message
        if (err.message && !err.message.includes('Failed to fetch')) {
          throw err
        }
        // If server offline, continue down to mock fallback
        console.warn('Backend unavailable during login, falling back to mock authentication:', err.message)
      }
    }

    // Mock Mode fallback
    await sleep(400)
    const match = DEMO_ACCOUNTS.find(
      (acc) => acc.username === credentials.username.trim() && acc.password === credentials.password
    )

    if (!match) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác. Hãy thử tài khoản mẫu bên dưới!')
    }

    const extra = MOCK_PROFILES[match.username] || {}
    const mockUser: AuthUser = {
      matk: match.role === 'AD' ? 1 : match.role === 'GV' ? 2 : 3,
      username: match.username,
      role: match.role,
      fullName: match.fullName,
      studentId: extra.studentId,
      lecturerId: extra.lecturerId,
      email: extra.email,
      faculty: extra.faculty,
    }

    const mockToken = `mock-jwt-token-${match.role.toLowerCase()}-${Date.now()}`
    apiClient.setToken(mockToken)

    return { user: mockUser, accessToken: mockToken }
  },

  logout: async (): Promise<void> => {
    if (apiClient.getMode() === 'backend') {
      try {
        await apiClient.request('/auth/logout', { method: 'POST' })
      } catch (err) {
        console.warn('Backend logout error (safe to ignore):', err)
      }
    }
    apiClient.setToken(null)
  },

  getMe: async (): Promise<AuthUser | null> => {
    const token = apiClient.getToken()
    if (!token) return null

    if (apiClient.getMode() === 'backend') {
      try {
        const res = await apiClient.request<any>('/auth/me')
        const extraProfile = MOCK_PROFILES[res.username] || {}
        return {
          matk: res.matk,
          username: res.username,
          role: res.role,
          fullName: extraProfile.fullName || res.username,
          studentId: extraProfile.studentId,
          lecturerId: extraProfile.lecturerId,
          email: extraProfile.email,
          faculty: extraProfile.faculty,
        }
      } catch {
        // Fallback
      }
    }
    return null
  },
}
