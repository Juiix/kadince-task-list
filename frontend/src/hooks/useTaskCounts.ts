import { isDueToday, isOverdue } from '../lib/dates'
import { useTasks } from './useTasks'

export interface TaskCounts {
  all: number
  pending: number
  completed: number
  today: number
}

/**
 * Counts are derived from the unfiltered list. react-query caches this under
 * ['tasks', 'ALL'], so it refetches alongside every mutation invalidation and
 * stays in sync with the filtered views.
 */
export function useTaskCounts(): TaskCounts | undefined {
  const { data: tasks } = useTasks('ALL')
  if (!tasks) return undefined

  const completed = tasks.filter((task) => task.completed).length
  const today = tasks.filter(
    (task) => isOverdue(task) || (isDueToday(task) && !task.completed),
  ).length

  return { all: tasks.length, pending: tasks.length - completed, completed, today }
}
