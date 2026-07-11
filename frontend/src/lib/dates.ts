import type { Task } from '../types'

/** Local date as YYYY-MM-DD (not UTC — "today" is the user's day). */
export function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function isOverdue(task: Task): boolean {
  return !!task.dueOn && !task.completed && task.dueOn < todayISO()
}

export function isDueToday(task: Task): boolean {
  return task.dueOn === todayISO()
}

const dueFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

export function formatDue(dueOn: string): string {
  if (dueOn === todayISO()) return 'Today'
  return dueFormat.format(new Date(`${dueOn}T00:00:00`))
}

export function byDueDate(a: Task, b: Task): number {
  return (a.dueOn ?? '9999').localeCompare(b.dueOn ?? '9999')
}
