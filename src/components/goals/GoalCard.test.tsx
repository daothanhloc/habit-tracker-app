import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { GoalCard } from './GoalCard'
import { apiHabit } from '@/test/fixtures'
import type { Goal } from '@/types/goal'

function renderCard(goal: Goal) {
  return render(
    <MemoryRouter>
      <GoalCard goal={goal} />
    </MemoryRouter>,
  )
}

// Cast: the API no longer sends unifiedProgress; a stale payload must be ignored.
const baseGoal = {
  id: 'goal-1',
  title: 'Get fit',
  startDate: '2026-10-01',
  endDate: '2026-10-31',
  unifiedProgress: { current: 50, target: 120 },
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
}

describe('GoalCard', () => {
  it('renders one row per habit with progress and streak, no goal-level progress', () => {
    const goal = {
      ...baseGoal,
      habits: [
        apiHabit({ id: 'h1', name: 'Read', progress: { current: 42, target: 100 }, currentStreak: 3 }),
        apiHabit({ id: 'h2', name: 'Run', progress: { current: 8, target: 20 }, currentStreak: 7 }),
      ],
    } as unknown as Goal
    renderCard(goal)

    expect(screen.getByText('Get fit')).toBeInTheDocument()
    expect(screen.getByText('Read')).toBeInTheDocument()
    expect(screen.getByText('Run')).toBeInTheDocument()
    expect(screen.getByText('42 / 100')).toBeInTheDocument()
    expect(screen.getByText('8 / 20')).toBeInTheDocument()
    expect(screen.getByText(/\b3\b/, { selector: '[data-testid="streak-h1"]' })).toBeInTheDocument()
    expect(screen.getByText(/\b7\b/, { selector: '[data-testid="streak-h2"]' })).toBeInTheDocument()

    expect(screen.queryByText(/overall/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Progress')).not.toBeInTheDocument()
    expect(screen.queryByText('50 / 120')).not.toBeInTheDocument()
    // one bar per habit only
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })

  it('shows "No habits yet" when the goal has no habits', () => {
    renderCard({ ...baseGoal, habits: [] } as unknown as Goal)
    expect(screen.getByText('No habits yet')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
