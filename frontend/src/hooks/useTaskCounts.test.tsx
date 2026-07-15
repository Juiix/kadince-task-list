import { describe, expect, it } from 'vitest'
import { tallyTasks } from './useTaskCounts'
import { makeTask } from '../test/factories'
import { todayISO } from '../lib/dates';

function isoDaysFromToday(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

describe('tallyTasks', () => {
    it('returns zeros for an empty array', () => {
        const counts = tallyTasks([])
        expect(counts.all).toBe(0)
        expect(counts.pending).toBe(0)
        expect(counts.completed).toBe(0)
        expect(counts.today).toBe(0)
    })

    it('returns valid today, pending, completed and all counts', () => {
        const tasks = [
            makeTask({ dueOn: todayISO() }), // 1 pending today
            makeTask({ dueOn: isoDaysFromToday(1) }),
            makeTask({ dueOn: isoDaysFromToday(1) }),
            makeTask({ dueOn: isoDaysFromToday(1) }), // 3 pending future
            makeTask({completed: true }) // 1 completed
        ]

        const counts = tallyTasks(tasks)
        expect(counts.pending).toBe(4)
        expect(counts.completed).toBe(1)
        expect(counts.all).toBe(5)
        expect(counts.today).toBe(1)
    })

    it('today counts only pending tasks due today or earlier', () => {
        const tasks = [
            makeTask({ dueOn: isoDaysFromToday(-1) }), // 1 pending yesterday
            makeTask({ dueOn: isoDaysFromToday(-1), completed: true }), // 1 complete yesterday
            makeTask({ dueOn: todayISO() }),
            makeTask({ dueOn: todayISO() }), // 2 pending today
            makeTask({ dueOn: todayISO(), completed: true }), // 1 completed today
            makeTask({completed: true }) // 1 completed
        ]

        const counts = tallyTasks(tasks)
        expect(counts.today).toBe(3)
    })

    it('does not count null dueOn in today', () => {
        const tasks = [
            makeTask({ dueOn: null }), // 1 pending
            makeTask({ dueOn: null, completed: true }), // 1 complete
        ]

        const counts = tallyTasks(tasks)
        expect(counts.today).toBe(0)
    })
})