import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskEditor } from './TaskEditor'
import { useTaskStore } from '@/store/taskStore'
import type { HabitSummary } from '@/types/habit'

interface TaskTodayCardProps {
  habit: Pick<HabitSummary, 'id' | 'unit' | 'defaultTaskValue' | 'goalType' | 'dailyMinValue'>
}

export function TaskTodayCard({ habit }: TaskTodayCardProps) {
  const todayEntry = useTaskStore((state) => state.todayByHabitId[habit.id])
  const fetchToday = useTaskStore((state) => state.fetchToday)
  const upsertTask = useTaskStore((state) => state.upsertTask)

  useEffect(() => {
    fetchToday(habit.id)
  }, [habit.id, fetchToday])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
      </CardHeader>
      <CardContent>
        {todayEntry === undefined ? (
          <Skeleton className="h-16 w-full" />
        ) : todayEntry === 'unscheduled' ? (
          <p className="text-sm text-muted-foreground">Not scheduled today</p>
        ) : (
          <TaskEditor
            task={todayEntry}
            habit={habit}
            onSave={(data) => upsertTask(habit.id, todayEntry.date, data)}
          />
        )}
      </CardContent>
    </Card>
  )
}
