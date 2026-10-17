import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
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
import { GoalForm, type GoalFormValues } from '@/components/goals/GoalForm'
import { HabitForm } from '@/components/habits/HabitForm'
import { HabitCard } from '@/components/habits/HabitCard'
import { useGoalStore } from '@/store/goalStore'
import { useHabitStore } from '@/store/habitStore'
import { progressPercent } from '@/lib/progress'
import type { CreateHabitDto } from '@/types/habit'

export function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>()
  const navigate = useNavigate()

  const goals = useGoalStore((state) => state.goals)
  const fetchGoals = useGoalStore((state) => state.fetchGoals)
  const updateGoal = useGoalStore((state) => state.updateGoal)
  const deleteGoal = useGoalStore((state) => state.deleteGoal)

  const habitsByGoalId = useHabitStore((state) => state.habitsByGoalId)
  const fetchHabitsForGoal = useHabitStore((state) => state.fetchHabitsForGoal)
  const createHabit = useHabitStore((state) => state.createHabit)

  const [editOpen, setEditOpen] = useState(false)
  const [addHabitOpen, setAddHabitOpen] = useState(false)

  useEffect(() => {
    if (goals.length === 0) fetchGoals()
  }, [fetchGoals, goals.length])

  useEffect(() => {
    if (goalId) fetchHabitsForGoal(goalId)
  }, [goalId, fetchHabitsForGoal])

  const goal = goals.find((g) => g.id === goalId)
  const habits = goalId ? (habitsByGoalId[goalId] ?? goal?.habits ?? []) : []

  if (!goal) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const handleEditSubmit = async (values: GoalFormValues) => {
    await updateGoal(goal.id, values)
    setEditOpen(false)
  }

  const handleDelete = async () => {
    await deleteGoal(goal.id)
    navigate('/goals')
  }

  const handleCreateHabit = async (data: CreateHabitDto) => {
    const created = await createHabit(goal.id, data)
    if (created) setAddHabitOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{goal.title}</h2>
          <p className="text-sm text-muted-foreground">
            {format(parseISO(goal.startDate), 'MMM d, yyyy')} –{' '}
            {format(parseISO(goal.endDate), 'MMM d, yyyy')}
          </p>
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
                <DialogTitle>Edit Goal</DialogTitle>
              </DialogHeader>
              <GoalForm goal={goal} onSubmit={handleEditSubmit} onCancel={() => setEditOpen(false)} />
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
                <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                <AlertDialogDescription>
                  This deletes {habits.length} habit{habits.length === 1 ? '' : 's'} and all of
                  their tracked tasks. This cannot be undone.
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

      {goal.unifiedProgress && (
        <div className="space-y-1.5 rounded-lg border bg-card p-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall progress</span>
            <span>
              {goal.unifiedProgress.current} / {goal.unifiedProgress.target}
            </span>
          </div>
          <Progress
            value={progressPercent(goal.unifiedProgress.current, goal.unifiedProgress.target)}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Habits</h3>
        <Dialog open={addHabitOpen} onOpenChange={setAddHabitOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus /> Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Habit</DialogTitle>
            </DialogHeader>
            <HabitForm onSubmit={handleCreateHabit} onCancel={() => setAddHabitOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <p className="text-sm text-muted-foreground">No habits yet — add your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  )
}
