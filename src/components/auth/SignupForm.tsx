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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-base font-semibold">
              H
            </span>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Create your account</h2>
            <p className="text-sm text-muted-foreground">Start tracking goals and habits that matter</p>
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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={validationErrors.confirmPassword}
              disabled={isLoading}
              rightIcon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="size-4 rounded border-input text-primary focus:ring-ring/30 cursor-pointer"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer select-none">
                Agree with <span className="text-primary">Terms &amp; Conditions</span>
              </label>
            </div>
            {validationErrors.agreeTerms && (
              <p className="text-sm text-destructive">
                {validationErrors.agreeTerms}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-primary hover:underline"
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
