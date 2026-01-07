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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Sign in to continue tracking your habits</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl animate-pulse">
              <p className="text-red-600 text-sm font-bold text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="example@gmail.com"
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
              rightIcon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <div className="flex justify-end">
              <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                Forgot Password?
              </button>
            </div>

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
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all"
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
