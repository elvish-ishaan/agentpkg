import axios, { AxiosError, AxiosResponse } from 'axios'
import type { ApiResponse, ApiError } from '@/types/api'
import { clientTokenManager } from '@/lib/auth/token-manager'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Client-side axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
})

// Request interceptor to attach auth token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = clientTokenManager.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to extract data from { success: true, data: {...} }
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Extract data from the success wrapper
    if (response.data && response.data.success && response.data.data !== undefined) {
      return { ...response, data: response.data.data }
    }
    return response
  },
  (error: AxiosError<ApiError>) => {
    // Handle errors
    if (error.response) {
      const errorData = error.response.data
      const errorMessage = errorData?.message || errorData?.error || 'An error occurred'

      // Don't redirect to login here - let middleware handle authentication redirects
      // This prevents infinite redirect loops

      // Return a formatted error
      return Promise.reject(new Error(errorMessage))
    }

    // Network error
    return Promise.reject(new Error('Network error. Please check your connection.'))
  }
)

// Server-side axios instance factory (for use in server components/actions)
export function createServerApiClient(token?: string) {
  const serverClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  // Add same response interceptor
  serverClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => {
      if (response.data && response.data.success && response.data.data !== undefined) {
        return { ...response, data: response.data.data }
      }
      return response
    },
    (error: AxiosError<ApiError>) => {
      if (error.response) {
        const errorData = error.response.data
        const errorMessage = errorData?.message || errorData?.error || 'An error occurred'
        return Promise.reject(new Error(errorMessage))
      }
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }
  )

  return serverClient
}
