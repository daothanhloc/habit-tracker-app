import { useEffect, useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { TaskEditor } from './TaskEditor'
import { useTaskStore } from '@/store/taskStore'
import type { HabitSummary } from '@/types/habit'
import type { Task } from '@/types/task'

interface TaskCalendarGridProps {
  habit: Pick<HabitSummary, 'id' | 'unit' | 'defaultTaskValue' | 'goalType' | 'dailyMinValue' | 'frequencyDays'>
}

function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function TaskCalendarGrid({ habit }: TaskCalendarGridProps) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const tasks = useTaskStore((state) => state.tasksByHabitId[habit.id]) ?? []
  const fetchRange = useTaskStore((state) => state.fetchRange)
  const upsertTask = useTaskStore((state) => state.upsertTask)

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  useEffect(() => {
    // Request only the visible month, not the whole goal period — lazy
    // task creation handles the rest as the user navigates (see
    // HABIT_TRACKER_V2_FRONTEND.md §5.4 / §10 item 1).
    fetchRange(habit.id, toDateString(monthStart), toDateString(monthEnd))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit.id, monthStart.getTime(), monthEnd.getTime()])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task>()
    tasks.forEach((t) => map.set(t.date, t))
    return map
  }, [tasks])

  const scheduledSet = useMemo(() => new Set(habit.frequencyDays), [habit.frequencyDays])

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(monthStart),
        end: endOfWeek(monthEnd),
      }),
    [monthStart, monthEnd]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => subMonths(m, 1))}>
          <ChevronLeft />
        </Button>
        <p className="text-sm font-medium">{format(month, 'MMMM yyyy')}</p>
        <Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, 1))}>
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = toDateString(day)
          const isScheduled = scheduledSet.has(getDay(day))
          const inMonth = isSameMonth(day, month)
          const task = tasksByDate.get(dateStr)
          // listRange only creates/returns rows for scheduled dates up to and
          // including "today" (server-side, VNT) — so once the range fetch
          // has resolved, a scheduled date with no row is necessarily in the
          // future. This detects "future" from server data alone, without
          // ever computing "today" client-side (see the date-string gotcha
          // in HABIT_TRACKER_V2_FRONTEND.md §6 — browser-local `new Date()`
          // comparisons can be off by a day from the API's fixed day
          // boundary). The API also rejects a future PUT outright (400 "is
          // in the future and cannot be completed yet"), which is still the
          // backstop if this fires before the range fetch has resolved.
          const isFuture = isScheduled && !task

          const cellClasses = cn(
            'aspect-square rounded-md border text-xs flex items-center justify-center',
            !inMonth && 'opacity-30',
            !isScheduled && 'cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground',
            isFuture && 'cursor-not-allowed border-dashed text-muted-foreground',
            isScheduled &&
              !isFuture &&
              task?.status === 'done' &&
              'border-primary bg-primary text-primary-foreground',
            isScheduled && !isFuture && task?.status !== 'done' && 'border-dashed'
          )

          // Off-schedule and future days can't be logged — disable the cell
          // rather than let the user open it and get rejected after the fact
          // (see HABIT_TRACKER_V2_FRONTEND.md §5.4 / §10 item 2).
          if (!isScheduled || isFuture || !task) {
            return (
              <div key={dateStr} className={cellClasses}>
                {format(day, 'd')}
              </div>
            )
          }

          return (
            <Popover key={dateStr}>
              <PopoverTrigger asChild>
                <button type="button" className={cn(cellClasses, 'hover:ring-2 hover:ring-ring')}>
                  {format(day, 'd')}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <TaskEditor
                  task={task}
                  habit={habit}
                  onSave={(data) => upsertTask(habit.id, dateStr, data)}
                />
              </PopoverContent>
            </Popover>
          )
        })}
      </div>
    </div>
  )
}
