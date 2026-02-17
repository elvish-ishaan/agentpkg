'use client'

import React, { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/endpoints/auth'
import { queryKeys } from '@/lib/api/query-keys'
import { setAuthToken, removeAuthToken } from './token-manager'
import { clientTokenManager } from './client-token-manager'
import type { User, LoginData, RegisterData } from '@/types/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<{ user: User; token: string }>
  register: (data: RegisterData) => Promise<{ user: User; token: string; org: any }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch current user - will fail gracefully if no token exists
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always attempt to fetch - API will return 401 if no valid token
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Set token in HTTP-only cookie
      await setAuthToken(data.token)
      // Also store in localStorage for client-side API requests
      clientTokenManager.set(data.token)
      // Update user in cache
      queryClient.setQueryData(queryKeys.auth.me(), data.user)
      // Redirect to dashboard
      router.push('/dashboard')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      // Set token in HTTP-only cookie
      await setAuthToken(data.token)
      // Also store in localStorage for client-side API requests
      clientTokenManager.set(data.token)
      // Update user in cache
      queryClient.setQueryData(queryKeys.auth.me(), data.user)
      // Redirect to dashboard
      router.push('/dashboard')
    },
  })

  // Logout function
  const logout = async () => {
    await removeAuthToken()
    // Also remove from localStorage
    clientTokenManager.remove()
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
    router.refresh() // Force middleware to re-run and see cookie is gone
    router.push('/')
  }

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
