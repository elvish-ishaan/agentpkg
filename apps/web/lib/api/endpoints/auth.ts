import { apiClient } from '../client'
import type {
  User,
  LoginData,
  RegisterData,
  ApiToken,
  CreateTokenData,
} from '@/types/api'

export const authApi = {
  // Login
  login: async (data: LoginData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  // Register
  register: async (data: RegisterData): Promise<{ user: User; token: string; org: any }> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  // Create API token
  createToken: async (data: CreateTokenData): Promise<ApiToken> => {
    const response = await apiClient.post('/auth/token', data)
    return response.data
  },

  // List API tokens
  listTokens: async (): Promise<ApiToken[]> => {
    const response = await apiClient.get('/auth/tokens')
    return response.data
  },

  // Revoke API token
  revokeToken: async (id: string): Promise<void> => {
    await apiClient.delete(`/auth/token/${id}`)
  },
}
