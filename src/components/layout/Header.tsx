import React from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '@/components/ui/button'

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 max-w-7xl">
        <Link to="/goals" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
            H
          </span>
          <span className="text-lg font-semibold tracking-tight">Habit Tracker</span>
        </Link>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
