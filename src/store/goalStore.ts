import { create } from 'zustand'
import { toast } from 'sonner'
import type { Goal, CreateGoalDto, UpdateGoalDto } from '../types/goal'
import { goalService } from '../services/goalService'
import { getErrorMessage } from '../lib/errorMessage'

interface GoalState {
  goals: Goal[]
  loading: boolean
  fetchGoals: () => Promise<void>
  createGoal: (data: CreateGoalDto) => Promise<Goal | null>
  updateGoal: (id: string, data: UpdateGoalDto) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true })
    try {
      const goals = await goalService.list()
      set({ goals, loading: false })
    } catch (error) {
      set({ loading: false })
      toast.error(getErrorMessage(error, 'Failed to load goals'))
    }
  },

  createGoal: async (data) => {
    try {
      const goal = await goalService.create(data)
      set((state) => ({ goals: [...state.goals, goal] }))
      toast.success('Goal created')
      return goal
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to create goal'))
      return null
    }
  },

  updateGoal: async (id, data) => {
    try {
      const updated = await goalService.update(id, data)
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updated : g)),
      }))
      toast.success('Goal updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update goal'))
    }
  },

  deleteGoal: async (id) => {
    try {
      await goalService.remove(id)
      set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
      toast.success('Goal deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete goal'))
    }
  },
}))
