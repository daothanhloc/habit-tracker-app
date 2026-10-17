import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Flame, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { HabitForm } from '@/components/habits/HabitForm'
import { TaskTodayCard } from '@/components/tasks/TaskTodayCard'
import { TaskCalendarGrid } from '@/components/tasks/TaskCalendarGrid'
import { useHabitStore } from '@/store/habitStore'
import { formatProgressTarget, progressPercent } from '@/lib/progress'
import type { CreateHabitDto, HabitGoalType } from '@/types/habit'

const GOAL_TYPE_LABEL: Record<HabitGoalType, string> = {
  SUM: 'Total target',
  THRESHOLD_COUNT: 'Daily minimum',
}

export function HabitDetailPage() {
  const { habitId } = useParams<{ habitId: string }>()
  const navigate = useNavigate()

  const habit = useHabitStore((state) => state.currentHabit)
  const fetchHabit = useHabitStore((state) => state.fetchHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)
  const deleteHabit = useHabitStore((state) => state.deleteHabit)

  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    if (habitId) fetchHabit(habitId)
  }, [habitId, fetchHabit])

  if (!habit || habit.id !== habitId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  const handleEditSubmit = async (data: CreateHabitDto) => {
    await updateHabit(habit.id, data)
    setEditOpen(false)
  }

  const handleDelete = async () => {
    await deleteHabit(habit.id, habit.goalId)
    navigate(`/goals/${habit.goalId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{habit.name}</h2>
            <Badge variant="secondary">{GOAL_TYPE_LABEL[habit.goalType]}</Badge>
          </div>
          {habit.unit && <p className="text-sm text-muted-foreground">{habit.unit}</p>}
        </div>
        <div className="flex gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Habit</DialogTitle>
              </DialogHeader>
              <HabitForm
                habit={habit}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this habit?</AlertDialogTitle>
                <AlertDialogDescription>
                  This deletes all tracked tasks for "{habit.name}". This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} variant="destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Flame className="size-6 text-orange-500" />
            <span className="text-3xl font-semibold">{habit.currentStreak}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Longest streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Flame className="size-6 text-muted-foreground" />
            <span className="text-3xl font-semibold">{habit.longestStreak}</span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-1.5 rounded-lg border bg-card p-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>
            {habit.progress.current} / {formatProgressTarget(habit.progress.target)}
          </span>
        </div>
        <Progress value={progressPercent(habit.progress.current, habit.progress.target)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <TaskTodayCard habit={habit} />
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskCalendarGrid habit={habit} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
