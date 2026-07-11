import { describe, expect, it } from 'vitest'
import { byDueDate, formatDue, isDueToday, isOverdue, todayISO } from './dates'
import { makeTask } from '../test/factories'

function localISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const today = todayISO()
const yesterday = localISO(new Date(Date.now() - 24 * 60 * 60 * 1000))
const tomorrow = localISO(new Date(Date.now() + 24 * 60 * 60 * 1000))

describe('todayISO', () => {
  it('returns the local date in YYYY-MM-DD form', () => {
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(today).toBe(localISO(new Date()))
  })
})

describe('isOverdue', () => {
  it('is true for an incomplete task due before today', () => {
    expect(isOverdue(makeTask({ dueOn: yesterday }))).toBe(true)
  })

  it('is false for completed tasks even when past due', () => {
    expect(isOverdue(makeTask({ dueOn: yesterday, completed: true }))).toBe(false)
  })

  it('is false for tasks due today, in the future, or undated', () => {
    expect(isOverdue(makeTask({ dueOn: today }))).toBe(false)
    expect(isOverdue(makeTask({ dueOn: tomorrow }))).toBe(false)
    expect(isOverdue(makeTask({ dueOn: null }))).toBe(false)
  })
})

describe('isDueToday', () => {
  it('is true only for tasks due today', () => {
    expect(isDueToday(makeTask({ dueOn: today }))).toBe(true)
    expect(isDueToday(makeTask({ dueOn: tomorrow }))).toBe(false)
    expect(isDueToday(makeTask({ dueOn: null }))).toBe(false)
  })
})

describe('formatDue', () => {
  it('labels today as "Today"', () => {
    expect(formatDue(today)).toBe('Today')
  })

  it('formats other dates as a short month and day', () => {
    expect(formatDue('2026-12-25')).toMatch(/Dec\s?25/)
  })
})

describe('byDueDate', () => {
  it('sorts soonest first with undated tasks last', () => {
    const undated = makeTask({ dueOn: null })
    const soon = makeTask({ dueOn: today })
    const later = makeTask({ dueOn: tomorrow })

    expect([undated, later, soon].sort(byDueDate)).toEqual([soon, later, undated])
  })
})
