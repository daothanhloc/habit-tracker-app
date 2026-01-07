import React, { useState } from 'react'
import type { Habit, CreateHabitDto } from '../../types/habit'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { Select } from '../common/Select'
import { Palette, Repeat, Tag, AlignLeft, Type } from 'lucide-react'

interface HabitFormProps {
  habit?: Habit
  onSubmit: (data: CreateHabitDto) => Promise<void>
  onCancel: () => void
}

const COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Amber', value: '#F97316' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Cyan', value: '#06B6D4' },
]

const FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Every 2 days', value: 'custom' }, // Example custom opt
]

export const HabitForm: React.FC<HabitFormProps> = ({ habit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    frequency: habit?.frequency || 'daily',
    category: habit?.category || '',
    color: habit?.color || COLORS[0]?.value || '#3B82F6',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit(formData)
      onCancel()
    } catch (err) {
      setError('Failed to save habit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Habit Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Morning Exercise"
        icon={<Type size={20} />}
        required
      />

      <div className="w-full group">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
          Description
        </label>
        <div className="relative">
          <div className="absolute left-4 top-4 text-gray-400">
            <AlignLeft size={20} />
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., 30 min workout at the gym"
            className="w-full px-4 py-3.5 pl-12 rounded-xl bg-indigo-50/50 border-transparent outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 ease-out placeholder:text-gray-400 font-medium text-gray-700 resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Select
            label="Frequency"
            value={formData.frequency}
            onChange={(value) => setFormData({ ...formData, frequency: value as any })}
            options={FREQUENCY_OPTIONS}
            icon={<Repeat size={20} />}
          />
        </div>

        <div>
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Health"
            icon={<Tag size={20} />}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 flex items-center gap-2">
          <Palette size={18} className="text-gray-500" />
          Choose Color
        </label>
        <div className="p-4 rounded-2xl bg-indigo-50/30 border-2 border-dashed border-indigo-100">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, color: color.value })}
                className={`
                  group relative h-10 w-10 rounded-full transition-all duration-300 ease-out flex items-center justify-center
                  ${formData.color === color.value
                    ? 'ring-4 ring-offset-2 scale-110 shadow-lg'
                    : 'hover:scale-110 hover:shadow-md'
                  }
                `}
                style={{
                  backgroundColor: color.value,
                  '--tw-ring-color': color.value
                } as React.CSSProperties}
                title={color.name}
              >
                {formData.color === color.value && (
                  <div className="w-4 h-4 bg-white rounded-full opacity-100 animate-scale-in" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-pulse">
          <p className="text-sm text-red-600 font-bold text-center">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1" size="lg">
          {loading ? 'Saving...' : habit ? 'Update Habit' : 'Create Habit'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} size="lg" className="flex-1 bg-gray-100 border-transparent hover:bg-gray-200 text-gray-600">
          Cancel
        </Button>
      </div>
    </form>
  )
}
