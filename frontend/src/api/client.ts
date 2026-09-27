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

class ApiClient {
  private mode: DataSourceMode = 'mock'
  private backendAvailable: boolean = false
  private baseUrl: string = API_BASE_URL

  constructor() {
    // Check saved preference
    const savedMode = localStorage.getItem('cnpm_datasource_mode') as DataSourceMode
    if (savedMode === 'backend' || savedMode === 'mock') {
      this.mode = savedMode
    }
  }

  getMode(): DataSourceMode {
    return this.mode
  }

  setMode(mode: DataSourceMode): void {
    this.mode = mode
    localStorage.setItem('cnpm_datasource_mode', mode)
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
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      
      const res = await fetch('http://localhost:3000/api/docs', {
        method: 'GET',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      this.backendAvailable = res.ok || res.status === 404 || res.status === 200
      return this.backendAvailable
    } catch {
      this.backendAvailable = false
      return false
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
