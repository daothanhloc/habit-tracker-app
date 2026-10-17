import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'sonner'
import type { Task, UpsertTaskDto } from '../types/task'
import { taskService } from '../services/taskService'
import { getErrorMessage } from '../lib/errorMessage'
import { useHabitStore } from './habitStore'

type TodayEntry = Task | 'unscheduled'

interface TaskState {
  tasksByHabitId: Record<string, Task[]>
  todayByHabitId: Record<string, TodayEntry>
  loading: boolean
  fetchRange: (habitId: string, from: string, to: string) => Promise<void>
  fetchToday: (habitId: string) => Promise<void>
  upsertTask: (habitId: string, date: string, data: UpsertTaskDto) => Promise<void>
  clearRangeCache: (habitId: string) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasksByHabitId: {},
  todayByHabitId: {},
  loading: false,

  fetchRange: async (habitId, from, to) => {
    set({ loading: true })
    try {
      const tasks = await taskService.listRange(habitId, from, to)
      set((state) => ({
        tasksByHabitId: { ...state.tasksByHabitId, [habitId]: tasks },
        loading: false,
      }))
    } catch (error) {
      set({ loading: false })
      toast.error(getErrorMessage(error, 'Failed to load tasks'))
    }
  },

  fetchToday: async (habitId) => {
    try {
      const task = await taskService.today(habitId)
      set((state) => ({
        todayByHabitId: { ...state.todayByHabitId, [habitId]: task },
      }))
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        set((state) => ({
          todayByHabitId: { ...state.todayByHabitId, [habitId]: 'unscheduled' },
        }))
        return
      }
      toast.error(getErrorMessage(error, "Failed to load today's task"))
    }
  },

  upsertTask: async (habitId, date, data) => {
    try {
      const updated = await taskService.upsert(habitId, date, data)

      set((state) => {
        const existingRange = state.tasksByHabitId[habitId] ?? []
        const hasDate = existingRange.some((t) => t.date === date)
        const nextRange = hasDate
          ? existingRange.map((t) => (t.date === date ? updated : t))
          : [...existingRange, updated]

        const todayEntry = state.todayByHabitId[habitId]
        const todayByHabitId =
          typeof todayEntry === 'object' && todayEntry.date === date
            ? { ...state.todayByHabitId, [habitId]: updated }
            : state.todayByHabitId

        return {
          tasksByHabitId: { ...state.tasksByHabitId, [habitId]: nextRange },
          todayByHabitId,
        }
      })

      // The API recomputes currentStreak/longestStreak on every status
      // change — refetch the habit rather than recompute streaks client-side
      // (see HABIT_TRACKER_V2_FRONTEND.md §4.2/§6).
      await useHabitStore.getState().fetchHabit(habitId)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save task'))
    }
  },

  clearRangeCache: (habitId) => {
    set((state) => {
      const next = { ...state.tasksByHabitId }
      delete next[habitId]
      return { tasksByHabitId: next }
    })
  },
}))
