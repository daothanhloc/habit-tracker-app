import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HabitForm } from './HabitForm'
import { apiHabit } from '@/test/fixtures'

describe('HabitForm edit mode', () => {
  it('shows daily minimum and target days for a THRESHOLD_COUNT habit', () => {
    const habit = apiHabit({
      goalType: 'THRESHOLD_COUNT',
      dailyMinValue: 30,
      targetDays: 20,
      targetValue: null,
    })
    render(<HabitForm habit={habit} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText('Daily minimum')).toHaveValue(30)
    expect(screen.getByLabelText('Target days')).toHaveValue(20)
    expect(screen.queryByLabelText('Target value')).not.toBeInTheDocument()
  })

  it('shows the target value for a SUM habit', () => {
    render(
      <HabitForm
        habit={apiHabit({ goalType: 'SUM', targetValue: 100 })}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Target value')).toHaveValue(100)
    expect(screen.queryByLabelText('Daily minimum')).not.toBeInTheDocument()
  })
})
