import { useEffect } from 'react'
import { useHabitStore } from './store/habitStore'
import { useAuthStore } from './store/authStore'
import { useAuthInit } from './hooks/useAuthInit'
import { Layout } from './components/layout/Layout'
import { HabitList } from './components/habits/HabitList'
import { AuthContainer } from './components/auth/AuthContainer'
import { LoadingSpinner } from './components/common/LoadingSpinner'

function App() {
  // Initialize auth on app load
  useAuthInit()

  const { isAuthenticated, isLoading: authLoading } = useAuthStore()
  const fetchHabits = useHabitStore((state) => state.fetchHabits)

  // Expose auth store to window for axios interceptors (solve circular dependency)
  useEffect(() => {
    ;(window as any).__authStore__ = {
      get accessToken() {
        return useAuthStore.getState().accessToken
      },
      set accessToken(token: string | null) {
        useAuthStore.setState({ accessToken: token })
      },
      get user() {
        return useAuthStore.getState().user
      },
      set user(user: any) {
        useAuthStore.setState({ user })
      },
      get isAuthenticated() {
        return useAuthStore.getState().isAuthenticated
      },
      set isAuthenticated(value: boolean) {
        useAuthStore.setState({ isAuthenticated: value })
      },
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchHabits()
    }
  }, [isAuthenticated, fetchHabits])

  // Show loading spinner during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    )
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return <AuthContainer />
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="mt-6">
          <HabitList />
        </div>
      </Layout>
    </div>
  )
}

export default App
