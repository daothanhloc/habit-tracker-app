import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  icon?: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  className = '',
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={`w-full group ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3.5 rounded-xl bg-indigo-50/50 border-transparent
            outline-none text-left flex items-center justify-between
            focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            transition-all duration-300 ease-out
            font-medium text-gray-700
            ${icon ? 'pl-12' : ''}
            ${isOpen ? 'ring-2 ring-indigo-500/20 bg-white' : ''}
          `}
        >
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <span className={!selectedOption ? 'text-gray-400' : ''}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? 'transform rotate-180 text-indigo-500' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in origin-top">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full px-4 py-2.5 text-left flex items-center justify-between
                    transition-colors duration-150
                    ${
                      value === option.value
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check size={16} className="text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
