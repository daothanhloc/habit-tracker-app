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
    <div className="w-full group">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3.5 rounded-xl bg-indigo-50/50 border-transparent
            outline-none
            focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            transition-all duration-300 ease-out
            placeholder:text-gray-400 font-medium text-gray-700
            ${icon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${error ? 'bg-red-50/50 ring-2 ring-red-100 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 ml-1 text-sm text-red-500 font-medium animate-slide-in-left">
          {error}
        </p>
      )}
    </div>
  )
}
