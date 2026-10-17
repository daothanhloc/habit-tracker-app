import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { useTaskStore } from './taskStore'
import { useHabitStore } from './habitStore'
import { taskService } from '@/services/taskService'
import { habitService } from '@/services/habitService'
import { apiHabit, apiTask } from '@/test/fixtures'

vi.mock('@/services/taskService', () => ({
  taskService: { listRange: vi.fn(), today: vi.fn(), upsert: vi.fn() },
}))
vi.mock('@/services/habitService', () => ({
  habitService: { get: vi.fn() },
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

const DATE = '2026-10-17'

describe('taskStore.upsertTask', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useTaskStore.setState({
      tasksByHabitId: { 'habit-1': [apiTask({ date: DATE, status: 'NOT_DONE' })] },
      todayByHabitId: { 'habit-1': apiTask({ date: DATE, status: 'NOT_DONE' }) },
      loading: false,
    })
    useHabitStore.setState({
      habitsByGoalId: {},
      currentHabit: apiHabit({ currentStreak: 0 }),
      loading: false,
    })
  })

  it('updates the range, today entry and the habit streak', async () => {
    vi.mocked(taskService.upsert).mockResolvedValue(apiTask({ date: DATE, status: 'DONE' }))
    vi.mocked(habitService.get).mockResolvedValue(apiHabit({ currentStreak: 3 }))

    await useTaskStore.getState().upsertTask('habit-1', DATE, { status: 'done', value: null })

    expect(taskService.upsert).toHaveBeenCalledWith('habit-1', DATE, { status: 'done', value: null })
    expect(useTaskStore.getState().tasksByHabitId['habit-1']).toEqual([
      apiTask({ date: DATE, status: 'DONE' }),
    ])
    expect(useTaskStore.getState().todayByHabitId['habit-1']).toEqual(
      apiTask({ date: DATE, status: 'DONE' }),
    )
    expect(habitService.get).toHaveBeenCalledWith('habit-1')
    expect(useHabitStore.getState().currentHabit?.currentStreak).toBe(3)
  })

  it('leaves today untouched when the date is not today', async () => {
    const other = '2026-10-12'
    vi.mocked(taskService.upsert).mockResolvedValue(apiTask({ id: 't2', date: other, status: 'DONE' }))
    vi.mocked(habitService.get).mockResolvedValue(apiHabit({ currentStreak: 1 }))

    await useTaskStore.getState().upsertTask('habit-1', other, { status: 'done', value: null })

    expect(useTaskStore.getState().tasksByHabitId['habit-1']).toHaveLength(2)
    expect(useTaskStore.getState().todayByHabitId['habit-1']).toEqual(
      apiTask({ date: DATE, status: 'NOT_DONE' }),
    )
  })

  it('keeps state unchanged and does not throw when the upsert rejects', async () => {
    vi.mocked(taskService.upsert).mockRejectedValue(new Error('boom'))
    const before = {
      tasks: useTaskStore.getState().tasksByHabitId,
      today: useTaskStore.getState().todayByHabitId,
    }

    await expect(
      useTaskStore.getState().upsertTask('habit-1', DATE, { status: 'done', value: null }),
    ).resolves.toBeUndefined()

    expect(useTaskStore.getState().tasksByHabitId).toBe(before.tasks)
    expect(useTaskStore.getState().todayByHabitId).toBe(before.today)
    expect(useHabitStore.getState().currentHabit?.currentStreak).toBe(0)
    expect(habitService.get).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
  })
})
