import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toGoalTypeInput } from '@/lib/enums'
import type { CreateHabitDto, Habit } from '@/types/habit'

const DAYS = [
  { value: '0', label: 'Sun' },
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thu' },
  { value: '5', label: 'Fri' },
  { value: '6', label: 'Sat' },
]

function positiveNumberString(label: string) {
  return z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: `${label} must be a positive number`,
    })
}

const baseShape = {
  name: z.string().min(1, 'Name is required').max(255),
  unit: z.string(),
  frequencyDays: z.array(z.string()).min(1, 'Pick at least one day'),
  defaultTaskValue: z.string(),
}

const habitSchema = z.discriminatedUnion('goalType', [
  z.object({
    goalType: z.literal('sum'),
    ...baseShape,
    targetValue: positiveNumberString('Target value'),
  }),
  z.object({
    goalType: z.literal('threshold_count'),
    ...baseShape,
    dailyMinValue: positiveNumberString('Daily minimum'),
    targetDays: positiveNumberString('Target days'),
  }),
])

type HabitFormValues = z.infer<typeof habitSchema>

function habitFormValuesToDto(values: HabitFormValues): CreateHabitDto {
  const base = {
    name: values.name,
    unit: values.unit.trim() === '' ? null : values.unit.trim(),
    frequencyDays: values.frequencyDays.map(Number),
    defaultTaskValue:
      values.defaultTaskValue.trim() === '' ? undefined : Number(values.defaultTaskValue),
  }
  if (values.goalType === 'sum') {
    return { ...base, goalType: 'sum', targetValue: Number(values.targetValue) }
  }
  return {
    ...base,
    goalType: 'threshold_count',
    dailyMinValue: Number(values.dailyMinValue),
    targetDays: Number(values.targetDays),
  }
}

function habitToDefaults(habit?: Habit): HabitFormValues {
  const base = {
    name: habit?.name ?? '',
    unit: habit?.unit ?? '',
    frequencyDays: habit?.frequencyDays.map(String) ?? [],
    defaultTaskValue: habit?.defaultTaskValue != null ? String(habit.defaultTaskValue) : '',
  }
  const goalType = habit ? toGoalTypeInput(habit.goalType) : 'sum'
  if (habit && goalType === 'threshold_count') {
    return {
      ...base,
      goalType,
      dailyMinValue: habit.dailyMinValue != null ? String(habit.dailyMinValue) : '',
      targetDays: habit.targetDays != null ? String(habit.targetDays) : '',
    }
  }
  return {
    ...base,
    goalType: 'sum',
    targetValue: habit?.targetValue != null ? String(habit.targetValue) : '',
  }
}

interface HabitFormProps {
  habit?: Habit
  onSubmit: (data: CreateHabitDto) => Promise<void>
  onCancel: () => void
}

export function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: habitToDefaults(habit),
  })

  const goalType = form.watch('goalType')

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(habitFormValuesToDto(values))
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {habit && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Unscheduled tasks will be regenerated under the new rules; completed tasks are
            untouched.
          </p>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Run" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., km" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defaultTaskValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default value (optional)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="e.g., 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="goalType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  const current = form.getValues()
                  if (value === 'sum') {
                    form.reset(
                      { ...current, goalType: 'sum', targetValue: '' },
                      { keepDefaultValues: true }
                    )
                  } else {
                    form.reset(
                      {
                        ...current,
                        goalType: 'threshold_count',
                        dailyMinValue: '',
                        targetDays: '',
                      },
                      { keepDefaultValues: true }
                    )
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sum">Total target (sum)</SelectItem>
                  <SelectItem value="threshold_count">Daily minimum, X days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {goalType === 'sum' ? (
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="e.g., 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dailyMinValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily minimum</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="e.g., 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target days</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="frequencyDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled days</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex-wrap justify-start"
                >
                  {DAYS.map((day) => (
                    <ToggleGroupItem key={day.value} value={day.value}>
                      {day.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormDescription>Pick the days of the week this habit is scheduled.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {habit ? 'Save changes' : 'Create habit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
