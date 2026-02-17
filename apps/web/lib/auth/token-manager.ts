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
