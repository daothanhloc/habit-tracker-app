import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from './store/authStore'
import { useAuthInit } from './hooks/useAuthInit'
import { Layout } from './components/layout/Layout'
import { AuthContainer } from './components/auth/AuthContainer'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { GoalListPage } from './pages/GoalListPage'
import { GoalDetailPage } from './pages/GoalDetailPage'
import { HabitDetailPage } from './pages/HabitDetailPage'

function App() {
  // Initialize auth on app load
  useAuthInit()

  const { isAuthenticated, isLoading: authLoading } = useAuthStore()

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

  // Show loading spinner during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <AuthContainer />
        <Toaster position="top-center" richColors />
      </>
    )
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/goals" replace />} />
          <Route path="/goals" element={<GoalListPage />} />
          <Route path="/goals/:goalId" element={<GoalDetailPage />} />
          <Route path="/habits/:habitId" element={<HabitDetailPage />} />
          <Route path="*" element={<Navigate to="/goals" replace />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  )
}

export default App
