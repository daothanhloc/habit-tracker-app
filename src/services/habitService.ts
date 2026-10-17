import { apiClient } from './api'
import type { Habit, HabitSummary, CreateHabitDto, UpdateHabitDto } from '../types/habit'

export const habitService = {
  listForGoal: async (goalId: string): Promise<HabitSummary[]> => {
    const response = await apiClient.get(`/goals/${goalId}/habits`)
    return response.data
  },

  createForGoal: async (goalId: string, data: CreateHabitDto): Promise<Habit> => {
    const response = await apiClient.post(`/goals/${goalId}/habits`, data)
    return response.data
  },

  get: async (id: string): Promise<Habit> => {
    const response = await apiClient.get(`/habits/${id}`)
    return response.data
  },

  update: async (id: string, data: UpdateHabitDto): Promise<Habit> => {
    const response = await apiClient.put(`/habits/${id}`, data)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/habits/${id}`)
  },
}
