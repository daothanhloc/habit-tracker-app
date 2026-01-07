import React, { useState } from 'react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { useAuthStore } from '../../store/authStore'
import { Eye, EyeOff } from 'lucide-react'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    agreeTerms?: string
  }>({})

  const { signup, isLoading, error, clearError } = useAuthStore()

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {}

    if (!name || name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

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

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms & Conditions'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      await signup({ email, password, name: name.trim() })
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Fill your information below or register with your social accounts</p>
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
              label="Name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={validationErrors.name}
              disabled={isLoading}
            />

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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={validationErrors.confirmPassword}
              disabled={isLoading}
              rightIcon={showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3 ml-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm font-semibold text-gray-600 cursor-pointer select-none">
                Agree with <span className="text-indigo-600 hover:underline">Terms & Conditions</span>
              </label>
            </div>
            {validationErrors.agreeTerms && (
              <p className="ml-1 text-sm text-red-500 font-medium animate-slide-in-left">
                {validationErrors.agreeTerms}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Already have Account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};
