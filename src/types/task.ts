// Responses use UPPERCASE enums; requests take lowercase.
export type TaskStatus = 'DONE' | 'NOT_DONE'
export type TaskStatusInput = 'done' | 'not_done'

export interface Task {
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  value: number | null
  status: TaskStatus
  completedAt: string | null
}

export interface UpsertTaskDto {
  value?: number | null
  status?: TaskStatusInput
}
