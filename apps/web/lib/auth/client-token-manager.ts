// Client-side token management (runs in browser)
const TOKEN_NAME = 'auth_token'

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
