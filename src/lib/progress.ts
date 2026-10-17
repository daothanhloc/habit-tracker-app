export function progressPercent(current: number, target: number | null): number {
  if (target == null || target <= 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

export function formatProgressTarget(target: number | null): string {
  return target == null ? '–' : String(target)
}
