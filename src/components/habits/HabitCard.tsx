import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatProgressTarget, progressPercent } from '@/lib/progress'
import type { HabitSummary } from '@/types/habit'

const GOAL_TYPE_LABEL: Record<HabitSummary['goalType'], string> = {
  sum: 'Total target',
  threshold_count: 'Daily minimum',
}

interface HabitCardProps {
  habit: HabitSummary
}

export function HabitCard({ habit }: HabitCardProps) {
  return (
    <Link to={`/habits/${habit.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>{habit.name}</CardTitle>
            {habit.unit && <p className="mt-0.5 text-xs text-muted-foreground">{habit.unit}</p>}
          </div>
          <Badge variant="secondary">{GOAL_TYPE_LABEL[habit.goalType]}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>
                {habit.progress.current} / {formatProgressTarget(habit.progress.target)}
              </span>
            </div>
            <Progress value={progressPercent(habit.progress.current, habit.progress.target)} />
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Flame className="size-4 text-orange-500" />
              <span className="font-medium">{habit.currentStreak}</span>
              <span className="text-muted-foreground">current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="size-4 text-muted-foreground" />
              <span className="font-medium">{habit.longestStreak}</span>
              <span className="text-muted-foreground">best</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
