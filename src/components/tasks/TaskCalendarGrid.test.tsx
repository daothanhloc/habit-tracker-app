import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { TaskCalendarGrid } from './TaskCalendarGrid'
import { useTaskStore } from '@/store/taskStore'
import { taskService } from '@/services/taskService'
import { apiHabit, apiTask } from '@/test/fixtures'

vi.mock('@/services/taskService', () => ({
  taskService: { listRange: vi.fn(), today: vi.fn(), upsert: vi.fn() },
}))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

// Fixed mid-month "today" (Saturday 2026-10-17) so the visible month and the
// past/future split are deterministic whatever day the suite runs. Only Date
// is faked so async rendering keeps working.
describe('TaskCalendarGrid', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 17, 12, 0, 0))
    useTaskStore.setState({ tasksByHabitId: {}, todayByHabitId: {}, loading: false })
    vi.mocked(taskService.listRange).mockResolvedValue([
      apiTask({ id: 't-done', date: '2026-10-12', status: 'DONE' }),
      apiTask({ id: 't-open', date: '2026-10-13', status: 'NOT_DONE' }),
    ])
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  // Mon-Fri scheduled; Oct 12 (Mon) and Oct 13 (Tue) are past tasks,
  // Oct 26 (Mon) is a future scheduled day, Oct 10 (Sat) is unscheduled.
  const habit = apiHabit({ frequencyDays: [1, 2, 3, 4, 5] })

  async function renderGrid() {
    render(<TaskCalendarGrid habit={habit} />)
    await waitFor(() => expect(screen.getByText('12').tagName).toBe('BUTTON'))
  }

  it('highlights a DONE task cell with the primary background', async () => {
    await renderGrid()
    const cell = screen.getByText('12')
    expect(cell).toHaveClass('bg-primary')
    expect(cell).not.toHaveClass('border-dashed')
  })

  it('shows a NOT_DONE task cell dashed and not highlighted', async () => {
    await renderGrid()
    const cell = screen.getByText('13')
    expect(cell).toHaveClass('border-dashed')
    expect(cell).not.toHaveClass('bg-primary')
  })

  it('renders future scheduled and unscheduled days as non-clickable divs', async () => {
    await renderGrid()
    expect(screen.getByText('26').tagName).toBe('DIV')
    expect(screen.getByText('10').tagName).toBe('DIV')
  })
})
