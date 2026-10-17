import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatProgressTarget, progressPercent } from '@/lib/progress'
import type { Goal } from '@/types/goal'

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <Link to={`/goals/${goal.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{goal.title}</CardTitle>
          <CardDescription>
            {format(parseISO(goal.startDate), 'MMM d, yyyy')} –{' '}
            {format(parseISO(goal.endDate), 'MMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goal.unifiedProgress ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>
                  {goal.unifiedProgress.current} / {goal.unifiedProgress.target}
                </span>
              </div>
              <Progress
                value={progressPercent(goal.unifiedProgress.current, goal.unifiedProgress.target)}
              />
            </div>
          ) : goal.habits.length > 0 ? (
            <div className="space-y-2.5">
              {goal.habits.map((habit) => (
                <div key={habit.id} className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{habit.name}</span>
                    <span>
                      {habit.progress.current} / {formatProgressTarget(habit.progress.target)}
                    </span>
                  </div>
                  <Progress
                    value={progressPercent(habit.progress.current, habit.progress.target)}
                    className="h-1"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No habits yet</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
