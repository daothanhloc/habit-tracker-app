import { create } from 'zustand'
import { toast } from 'sonner'
import type { Habit, HabitSummary, CreateHabitDto, UpdateHabitDto } from '../types/habit'
import { habitService } from '../services/habitService'
import { getErrorMessage } from '../lib/errorMessage'
import { useTaskStore } from './taskStore'

interface HabitState {
  habitsByGoalId: Record<string, HabitSummary[]>
  currentHabit: Habit | null
  loading: boolean
  fetchHabitsForGoal: (goalId: string) => Promise<void>
  fetchHabit: (id: string) => Promise<void>
  createHabit: (goalId: string, data: CreateHabitDto) => Promise<Habit | null>
  updateHabit: (id: string, data: UpdateHabitDto) => Promise<void>
  deleteHabit: (id: string, goalId: string) => Promise<void>
}

export const useHabitStore = create<HabitState>((set) => ({
  habitsByGoalId: {},
  currentHabit: null,
  loading: false,

  fetchHabitsForGoal: async (goalId) => {
    set({ loading: true })
    try {
      const habits = await habitService.listForGoal(goalId)
      set((state) => ({
        habitsByGoalId: { ...state.habitsByGoalId, [goalId]: habits },
        loading: false,
      }))
    } catch (error) {
      set({ loading: false })
      toast.error(getErrorMessage(error, 'Failed to load habits'))
    }
  },

  fetchHabit: async (id) => {
    set({ loading: true })
    try {
      const habit = await habitService.get(id)
      set({ currentHabit: habit, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(getErrorMessage(error, 'Failed to load habit'))
    }
  },

  createHabit: async (goalId, data) => {
    try {
      const habit = await habitService.createForGoal(goalId, data)
      set((state) => ({
        habitsByGoalId: {
          ...state.habitsByGoalId,
          [goalId]: [...(state.habitsByGoalId[goalId] ?? []), habit],
        },
      }))
      toast.success('Habit created')
      return habit
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create habit'))
      return null
    }
  },

  updateHabit: async (id, data) => {
    try {
      const updated = await habitService.update(id, data)
      set((state) => ({
        currentHabit: state.currentHabit?.id === id ? updated : state.currentHabit,
        habitsByGoalId: Object.fromEntries(
          Object.entries(state.habitsByGoalId).map(([goalId, habits]) => [
            goalId,
            habits.map((h) => (h.id === id ? updated : h)),
          ])
        ),
      }))
      // Editing a habit makes the API delete all NOT_DONE tasks for it (they
      // regenerate lazily under the new rules) — drop any cached range so the
      // calendar refetches instead of showing stale ghost entries.
      useTaskStore.getState().clearRangeCache(id)
      toast.success('Habit updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update habit'))
    }
  },

  deleteHabit: async (id, goalId) => {
    try {
      await habitService.remove(id)
      set((state) => ({
        habitsByGoalId: {
          ...state.habitsByGoalId,
          [goalId]: (state.habitsByGoalId[goalId] ?? []).filter((h) => h.id !== id),
        },
        currentHabit: state.currentHabit?.id === id ? null : state.currentHabit,
      }))
      toast.success('Habit deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete habit'))
    }
  },
}))
