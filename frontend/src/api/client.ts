/**
 * CNPM - QLHT API Client
 * Compatible with backend API specification (docs/API_contract.md)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export interface ApiResponse<T> {
  data?: T
  message?: string
  success?: boolean
}

export type DataSourceMode = 'mock' | 'backend'

export type UnauthorizedHandler = () => void

class ApiClient {
  private mode: DataSourceMode = 'backend'
  private backendAvailable: boolean = false
  private baseUrl: string = API_BASE_URL
  private token: string | null = null
  private unauthorizedHandlers: Set<UnauthorizedHandler> = new Set()

  constructor() {
    // Check saved preference - default is 'backend'
    const savedMode = localStorage.getItem('cnpm_datasource_mode') as DataSourceMode
    if (savedMode === 'backend' || savedMode === 'mock') {
      this.mode = savedMode
    } else {
      this.mode = 'backend'
    }
    const savedToken = localStorage.getItem('cnpm_access_token')
    if (savedToken) {
      this.token = savedToken
    }
  }

  onUnauthorized(handler: UnauthorizedHandler): () => void {
    this.unauthorizedHandlers.add(handler)
    return () => {
      this.unauthorizedHandlers.delete(handler)
    }
  }

  notifyUnauthorized(): void {
    this.unauthorizedHandlers.forEach((handler) => {
      try {
        handler()
      } catch (err) {
        console.error('Error executing unauthorized handler:', err)
      }
    })
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
  }

  getMode(): DataSourceMode {
    return this.mode
  }

  setMode(mode: DataSourceMode): void {
    this.mode = mode
    localStorage.setItem('cnpm_datasource_mode', mode)
  }

  setToken(token: string | null): void {
    this.token = token
    if (token) {
      localStorage.setItem('cnpm_access_token', token)
    } else {
      localStorage.removeItem('cnpm_access_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  isBackendAvailable(): boolean {
    return this.backendAvailable
  }

  setBackendAvailable(val: boolean): void {
    this.backendAvailable = val
  }

  async checkBackendHealth(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)
      
      const healthUrl = this.baseUrl.replace(/\/api\/v1\/?$/, '/health')
      const res = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      }).catch(async () => {
        return fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          signal: controller.signal,
        })
      })
      clearTimeout(timeoutId)
      this.backendAvailable = res.ok || res.status === 200
      return this.backendAvailable
    } catch {
      this.backendAvailable = false
      return false
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    }

    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        this.setToken(null)
        this.notifyUnauthorized()
      }
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      const message = errorData.message || (errorData.details ? JSON.stringify(errorData.details) : `API Error: ${response.status}`)
      const error = new Error(message)
      ;(error as any).status = response.status
      ;(error as any).details = errorData.details
      throw error
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
