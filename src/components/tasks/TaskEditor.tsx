import { useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { isTaskDone, isThreshold, toTaskStatusInput } from '@/lib/enums'
import type { Task, UpsertTaskDto } from '@/types/task'
import type { HabitSummary } from '@/types/habit'

interface TaskEditorProps {
  task: Task
  habit: Pick<HabitSummary, 'unit' | 'defaultTaskValue' | 'goalType' | 'dailyMinValue'>
  onSave: (data: UpsertTaskDto) => Promise<void>
}

// Every habit needs a numeric value regardless of whether it has a unit
// label — SUM sums it, THRESHOLD_COUNT compares it against dailyMinValue
// (`(value ?? 0) >= dailyMinValue` server-side). `unit` only controls
// whether a unit suffix is displayed, never whether value tracking applies.
// For a THRESHOLD_COUNT habit with no value yet, default to dailyMinValue
// so toggling "Done" with no edits naturally qualifies, matching the
// simple-checkbox feel a unit-less habit implies.
function initialValue(task: Task, habit: TaskEditorProps['habit']): string {
  if (task.value != null) return String(task.value)
  if (habit.defaultTaskValue != null) return String(habit.defaultTaskValue)
  if (isThreshold(habit.goalType) && habit.dailyMinValue != null) {
    return String(habit.dailyMinValue)
  }
  return ''
}

export function TaskEditor({ task, habit, onSave }: TaskEditorProps) {
  const [value, setValue] = useState(() => initialValue(task, habit))
  const [pending, setPending] = useState(0)
  // Saves are chained so they reach the server in the order the user made
  // them (a late value-only response must never overwrite a later status).
  const chain = useRef<Promise<unknown>>(Promise.resolve())
  const saving = pending > 0
  const done = isTaskDone(task)

  const enqueue = async (data: UpsertTaskDto) => {
    setPending((n) => n + 1)
    const run = chain.current.then(() => onSave(data))
    chain.current = run.catch(() => undefined)
    try {
      await run
    } finally {
      setPending((n) => n - 1)
    }
  }

  const currentValue = () => (value.trim() === '' ? null : Number(value))

  // Controls are never disabled while saving: the value input's blur fires
  // when the user presses the switch, and a disabled switch would drop that click.
  const handleToggle = (checked: boolean) =>
    enqueue({ status: toTaskStatusInput(checked), value: currentValue() })

  const handleValueBlur = () => enqueue({ value: currentValue() })

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`task-value-${task.id}`}>Value{habit.unit ? ` (${habit.unit})` : ''}</Label>
        <Input
          id={`task-value-${task.id}`}
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleValueBlur}
          aria-busy={saving}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor={`task-status-${task.id}`}>Done</Label>
        <Switch
          id={`task-status-${task.id}`}
          checked={done}
          onCheckedChange={handleToggle}
          aria-busy={saving}
        />
      </div>
      {task.completedAt && (
        <p className="text-xs text-muted-foreground">
          Completed {format(parseISO(task.completedAt), 'MMM d, yyyy p')}
        </p>
      )}
    </div>
  )
}
