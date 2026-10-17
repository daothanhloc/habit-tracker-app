import React, { useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { useAuthStore } from '../../store/authStore'
import { Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const { login, isLoading, error, clearError } = useAuthStore()

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {}

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      await login({ email, password })
    } catch (err) {
      // Error is handled by the store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-base font-semibold">
              H
            </span>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to continue tracking your habits</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={validationErrors.password}
              disabled={isLoading}
              rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-medium text-primary hover:underline"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
