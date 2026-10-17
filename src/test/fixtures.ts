import type { Habit } from '@/types/habit'
import type { Task } from '@/types/task'

// Mirrors real API responses: enums are UPPERCASE in responses
// (requests use lowercase).
export function apiTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    habitId: 'habit-1',
    date: '2026-10-17',
    value: null,
    status: 'NOT_DONE',
    completedAt: null,
    ...overrides,
  }
}

export function apiHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'habit-1',
    goalId: 'goal-1',
    name: 'Read',
    unit: 'pages',
    goalType: 'SUM',
    targetValue: 100,
    dailyMinValue: null,
    targetDays: null,
    frequencyDays: [0, 1, 2, 3, 4, 5, 6],
    defaultTaskValue: null,
    progress: { current: 0, target: 100 },
    currentStreak: 0,
    longestStreak: 0,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    ...overrides,
  }
}
