import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm, type GoalFormValues } from '@/components/goals/GoalForm'
import { useGoalStore } from '@/store/goalStore'

export function GoalListPage() {
  const goals = useGoalStore((state) => state.goals)
  const loading = useGoalStore((state) => state.loading)
  const fetchGoals = useGoalStore((state) => state.fetchGoals)
  const createGoal = useGoalStore((state) => state.createGoal)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const handleCreate = async (values: GoalFormValues) => {
    const goal = await createGoal(values)
    if (goal) setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Goals</h2>
          <p className="text-sm text-muted-foreground">Everything you're working toward</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Goal</DialogTitle>
            </DialogHeader>
            <GoalForm onSubmit={handleCreate} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {loading && goals.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No goals yet — create your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
