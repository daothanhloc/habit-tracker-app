import { apiClient } from './api'
import type { Task, UpsertTaskDto } from '../types/task'

export const taskService = {
  listRange: async (habitId: string, from: string, to: string): Promise<Task[]> => {
    const response = await apiClient.get(`/habits/${habitId}/tasks`, {
      params: { from, to },
    })
    return response.data
  },

  today: async (habitId: string): Promise<Task> => {
    const response = await apiClient.get(`/habits/${habitId}/tasks/today`)
    return response.data
  },

  upsert: async (habitId: string, date: string, data: UpsertTaskDto): Promise<Task> => {
    const response = await apiClient.put(`/habits/${habitId}/tasks/${date}`, data)
    return response.data
  },
}
