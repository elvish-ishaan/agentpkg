'use server'

import { cookies } from 'next/headers'

const TOKEN_NAME = 'auth_token'
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

export async function setAuthToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  })
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_NAME)?.value
}

export async function removeAuthToken() {
  const cookieStore = await cookies()
  // Explicitly set cookie with maxAge: 0 to ensure deletion with same config as when set
  cookieStore.set(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  })
}

// Client-side token management (not server actions)
export const clientTokenManager = {
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_NAME, token)
    }
  },

  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_NAME)
    }
    return null
  },

  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_NAME)
    }
  },
}
