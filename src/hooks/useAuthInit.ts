import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { tokenStorage } from '../services/tokenStorage'

let authInitTriggered = false

export const useAuthInit = () => {
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (authInitTriggered) return
    authInitTriggered = true

    // On app load, check if we have a refresh token
    const hasRefreshToken = tokenStorage.hasRefreshToken()

    if (hasRefreshToken && !isAuthenticated) {
      // Attempt to refresh and restore session
      refreshToken().catch((error) => {
        console.error('Failed to restore session:', error)
      })
    }
  }, [isAuthenticated, refreshToken]) // Only run once on mount

  return null
}
