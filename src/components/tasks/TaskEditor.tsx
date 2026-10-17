import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
  if (habit.goalType === 'threshold_count' && habit.dailyMinValue != null) {
    return String(habit.dailyMinValue)
  }
  return ''
}

export function TaskEditor({ task, habit, onSave }: TaskEditorProps) {
  const [value, setValue] = useState(() => initialValue(task, habit))
  const [saving, setSaving] = useState(false)
  const done = task.status === 'done'

  const handleToggle = async (checked: boolean) => {
    setSaving(true)
    try {
      await onSave({
        status: checked ? 'done' : 'not_done',
        value: value.trim() === '' ? null : Number(value),
      })
    } finally {
      setSaving(false)
    }
  }

  const handleValueBlur = async () => {
    setSaving(true)
    try {
      await onSave({ value: value.trim() === '' ? null : Number(value) })
    } finally {
      setSaving(false)
    }
  }

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
          disabled={saving}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor={`task-status-${task.id}`}>Done</Label>
        <Switch
          id={`task-status-${task.id}`}
          checked={done}
          onCheckedChange={handleToggle}
          disabled={saving}
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
