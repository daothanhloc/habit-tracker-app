// Responses use UPPERCASE enums; requests take lowercase.
export type HabitGoalType = 'SUM' | 'THRESHOLD_COUNT'
export type HabitGoalTypeInput = 'sum' | 'threshold_count'

export interface HabitSummary {
  id: string
  name: string
  unit: string | null
  goalType: HabitGoalType
  targetValue: number | null
  dailyMinValue: number | null
  targetDays: number | null
  frequencyDays: number[] // 0=Sun..6=Sat
  defaultTaskValue: number | null
  // target is null only if the habit is missing its required target fields
  // (shouldn't happen for valid data, but the API's schema allows it).
  progress: { current: number; target: number | null }
  currentStreak: number
  longestStreak: number
}

export interface Habit extends HabitSummary {
  goalId: string
  createdAt: string
  updatedAt: string
}

interface HabitBaseDto {
  name: string
  unit?: string | null
  frequencyDays: number[]
  defaultTaskValue?: number | null
}

export type CreateHabitDto = HabitBaseDto &
  (
    | { goalType: Extract<HabitGoalTypeInput, 'sum'>; targetValue: number; dailyMinValue?: never; targetDays?: never }
    | { goalType: Extract<HabitGoalTypeInput, 'threshold_count'>; dailyMinValue: number; targetDays: number; targetValue?: never }
  )

export type UpdateHabitDto = Partial<CreateHabitDto>
