import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode // Left icon
  rightIcon?: React.ReactNode // Right icon (e.g. toggle password)
  onRightIconClick?: () => void
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-3.5 py-2.5 rounded-lg bg-background border border-input
            outline-none
            focus:ring-2 focus:ring-ring/30 focus:border-ring
            transition-colors
            placeholder:text-muted-foreground text-foreground
            ${icon ? 'pl-11' : ''}
            ${rightIcon ? 'pr-11' : ''}
            ${error ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
