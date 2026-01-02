// Using localStorage for refresh token (accessible approach)
// Access token will be stored in Zustand (in-memory)

import { User } from '../types/auth'

const REFRESH_TOKEN_KEY = 'habitTracker_refreshToken'
const USER_KEY = 'habitTracker_user'

export const tokenStorage = {
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  clearRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasRefreshToken: (): boolean => {
    return !!localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  getUser: (): User | null => {
    const storedUser = localStorage.getItem(USER_KEY)
    if (!storedUser) return null

    try {
      return JSON.parse(storedUser) as User
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY)
  },
}
