import type { HabitGoalType, HabitGoalTypeInput } from '@/types/habit'
import type { Task, TaskStatusInput } from '@/types/task'

// The API returns UPPERCASE enums in responses and takes lowercase in
// requests. These helpers are the only place the two forms meet.

export function isTaskDone(task: Pick<Task, 'status'>): boolean {
  return task.status === 'DONE'
}

export function toTaskStatusInput(done: boolean): TaskStatusInput {
  return done ? 'done' : 'not_done'
}

export function toGoalTypeInput(goalType: HabitGoalType): HabitGoalTypeInput {
  return goalType === 'THRESHOLD_COUNT' ? 'threshold_count' : 'sum'
}

export function isThreshold(goalType: HabitGoalType): boolean {
  return goalType === 'THRESHOLD_COUNT'
}
