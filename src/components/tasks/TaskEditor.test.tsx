import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskEditor } from './TaskEditor'
import { apiHabit, apiTask } from '@/test/fixtures'

describe('TaskEditor', () => {
  it('shows the Done switch checked for a DONE task', () => {
    render(<TaskEditor task={apiTask({ status: 'DONE' })} habit={apiHabit()} onSave={vi.fn()} />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('shows the Done switch unchecked for a NOT_DONE task', () => {
    render(<TaskEditor task={apiTask({ status: 'NOT_DONE' })} habit={apiHabit()} onSave={vi.fn()} />)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('sends status done with a numeric value when toggled on', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(
      <TaskEditor
        task={apiTask({ status: 'NOT_DONE', value: 5 })}
        habit={apiHabit()}
        onSave={onSave}
      />,
    )
    await userEvent.click(screen.getByRole('switch'))
    expect(onSave).toHaveBeenCalledWith({ status: 'done', value: 5 })
  })

  it('sends status not_done when a checked switch is toggled off', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<TaskEditor task={apiTask({ status: 'DONE', value: 5 })} habit={apiHabit()} onSave={onSave} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ status: 'not_done' }))
  })

  it('pre-fills a threshold habit value from dailyMinValue and sends it', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const habit = apiHabit({
      goalType: 'THRESHOLD_COUNT',
      dailyMinValue: 10,
      targetDays: 5,
      targetValue: null,
      defaultTaskValue: null,
    })
    render(<TaskEditor task={apiTask({ value: null })} habit={habit} onSave={onSave} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(10)
    await userEvent.click(screen.getByRole('switch'))
    expect(onSave).toHaveBeenCalledWith({ status: 'done', value: 10 })
  })

  it('sends value null for a SUM habit with no default and no value', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<TaskEditor task={apiTask({ value: null })} habit={apiHabit()} onSave={onSave} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onSave).toHaveBeenCalledWith({ status: 'done', value: null })
  })

  it('does not drop the Done click after typing a value', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(
      <TaskEditor task={apiTask({ status: 'NOT_DONE', value: null })} habit={apiHabit()} onSave={onSave} />,
    )
    await userEvent.type(screen.getByRole('spinbutton'), '7')
    await userEvent.click(screen.getByRole('switch'))
    expect(onSave.mock.calls[onSave.mock.calls.length - 1]).toEqual([{ status: 'done', value: 7 }])
    expect(onSave.mock.calls.map((c) => c[0])).toEqual([
      { value: 7 },
      { status: 'done', value: 7 },
    ])
  })

  it('saves {value} on blur without a click', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<TaskEditor task={apiTask({ value: null })} habit={apiHabit()} onSave={onSave} />)
    await userEvent.type(screen.getByRole('spinbutton'), '7')
    await userEvent.tab()
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith({ value: 7 })
  })

  it('sends blank input as value null on blur', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<TaskEditor task={apiTask({ value: 5 })} habit={apiHabit()} onSave={onSave} />)
    await userEvent.clear(screen.getByRole('spinbutton'))
    await userEvent.tab()
    expect(onSave).toHaveBeenCalledWith({ value: null })
  })

  it('applies saves in order: the status save waits for the pending value save', async () => {
    const resolvers: Array<() => void> = []
    const started: unknown[] = []
    const onSave = vi.fn().mockImplementation(
      (data: unknown) =>
        new Promise<void>((resolve) => {
          started.push(data)
          resolvers.push(resolve)
        }),
    )
    render(
      <TaskEditor task={apiTask({ status: 'NOT_DONE', value: null })} habit={apiHabit()} onSave={onSave} />,
    )
    await userEvent.type(screen.getByRole('spinbutton'), '7')
    await userEvent.click(screen.getByRole('switch'))
    // Only the value save is in flight; the status save has not started.
    expect(started).toEqual([{ value: 7 }])
    resolvers[0]?.()
    await waitFor(() => expect(started).toHaveLength(2))
    expect(started[1]).toEqual({ status: 'done', value: 7 })
    resolvers[1]?.()
  })
})
