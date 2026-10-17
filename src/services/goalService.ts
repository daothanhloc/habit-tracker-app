import { apiClient } from './api'
import type { Goal, CreateGoalDto, UpdateGoalDto } from '../types/goal'

export const goalService = {
  list: async (): Promise<Goal[]> => {
    const response = await apiClient.get('/goals')
    return response.data
  },

  get: async (id: string): Promise<Goal> => {
    const response = await apiClient.get(`/goals/${id}`)
    return response.data
  },

  create: async (data: CreateGoalDto): Promise<Goal> => {
    const response = await apiClient.post('/goals', data)
    return response.data
  },

  update: async (id: string, data: UpdateGoalDto): Promise<Goal> => {
    const response = await apiClient.put(`/goals/${id}`, data)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`)
  },
}
