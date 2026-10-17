import type { HabitSummary } from './habit'

export interface Goal {
  id: string
  title: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  unifiedProgress: { current: number; target: number } | null
  habits: HabitSummary[]
  createdAt: string
  updatedAt: string
}

export interface CreateGoalDto {
  title: string
  startDate: string
  endDate: string
}

export type UpdateGoalDto = Partial<CreateGoalDto>
