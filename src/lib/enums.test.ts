import { describe, expect, it } from 'vitest'
import { isTaskDone, isThreshold, toGoalTypeInput, toTaskStatusInput } from './enums'

describe('enums', () => {
  it('isTaskDone reads the uppercase response status', () => {
    expect(isTaskDone({ status: 'DONE' })).toBe(true)
    expect(isTaskDone({ status: 'NOT_DONE' })).toBe(false)
  })
  it('toTaskStatusInput yields the lowercase request value', () => {
    expect(toTaskStatusInput(true)).toBe('done')
    expect(toTaskStatusInput(false)).toBe('not_done')
  })
  it('toGoalTypeInput yields the lowercase request value', () => {
    expect(toGoalTypeInput('THRESHOLD_COUNT')).toBe('threshold_count')
    expect(toGoalTypeInput('SUM')).toBe('sum')
  })
  it('isThreshold', () => {
    expect(isThreshold('THRESHOLD_COUNT')).toBe(true)
    expect(isThreshold('SUM')).toBe(false)
  })
})
