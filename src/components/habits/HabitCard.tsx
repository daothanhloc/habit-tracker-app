import React from 'react'
import type { Habit } from '../../types/habit'
import { Edit, Trash2, Eye, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '../common/Button'

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
  onTrack: (habitId: string) => void
  onViewDetails: (habitId: string) => void
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onEdit,
  onDelete,
  onTrack,
  onViewDetails,
}) => {
  const trackedToday = habit.trackedToday ?? false
  const emojiByCategory: Record<string, string> = {
    health: '💪',
    fitness: '🏃‍♂️',
    wellness: '🧘',
    productivity: '🎯',
    learning: '📚',
    sleep: '😴',
    finance: '💰',
    mindfulness: '🧠',
  }

  const emoji = emojiByCategory[habit.category?.toLowerCase()] || '🔥'

  const backgroundStyle = {
    background: `linear-gradient(135deg, ${habit.color}33, ${habit.color}55)`,
  }

  return (
    <div className="group relative animate-slide-in">
      <div className="absolute inset-0 rounded-2xl bg-white shadow-xl shadow-gray-200/60 transition duration-300 group-hover:-translate-y-1" />
      <div
        className="relative overflow-hidden rounded-2xl px-5 py-4 space-y-3"
        style={backgroundStyle}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 shadow-sm text-2xl shrink-0">
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-gray-900 truncate">{habit.name}</p>
                  <span className="text-xs font-semibold uppercase text-gray-700">
                    {habit.frequency}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-1">{habit.description}</p>
              </div>
              <Button
                onClick={() => onTrack(habit.id)}
                variant={trackedToday ? 'success' : 'secondary'}
                size="sm"
                className={`rounded-full px-4 ${
                  trackedToday ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-white/80'
                }`}
              >
                {trackedToday ? 'Tracked' : 'Track'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
              <span
                className="h-2.5 w-2.5 rounded-full border border-white shadow-inner"
                style={{ backgroundColor: habit.color }}
              />
              {habit.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                trackedToday ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {trackedToday ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {trackedToday ? 'Done' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onViewDetails(habit.id)}
              variant="ghost"
              size="sm"
              className="px-2 text-gray-700 hover:bg-white/60"
            >
              <Eye size={16} />
            </Button>
            <Button
              onClick={() => onEdit(habit)}
              variant="ghost"
              size="sm"
              className="px-2 text-gray-700 hover:bg-white/60"
            >
              <Edit size={16} />
            </Button>
            <Button
              onClick={() => onDelete(habit.id)}
              variant="ghost"
              size="sm"
              className="px-2 text-red-600 hover:bg-white/60"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
