import React, { createContext, useState, useEffect, useCallback } from 'react'
import { authApi, type DemoAccount } from '@/api/authApi'
import { apiClient } from '@/api/client'
import type { AuthUser, LoginCredentials } from '@/types/auth'

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
  switchDemoAccount: (demo: DemoAccount) => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'cnpm_current_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Verify token or active session on startup
  useEffect(() => {
    const token = apiClient.getToken()
    if (token && !user) {
      authApi.getMe().then((fetched) => {
        if (fetched) {
          setUser(fetched)
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fetched))
        }
      }).catch(() => {
        // silently ignore
      })
    }
  }, [user])

  const login = useCallback(async (credentials: LoginCredentials, rememberMe: boolean = true) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authApi.login(credentials)
      setUser(result.user)
      if (rememberMe) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
      } else {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
      }
    } catch (err: any) {
      const message = err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      localStorage.removeItem(USER_STORAGE_KEY)
      sessionStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem('cnpm_access_token')
      setIsLoading(false)
    }
  }, [])

  const switchDemoAccount = useCallback(async (demo: DemoAccount) => {
    await login({ username: demo.username, password: demo.password }, true)
  }, [login])

  const clearError = useCallback(() => setError(null), [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    switchDemoAccount,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth } from '@/hooks/useAuth'
