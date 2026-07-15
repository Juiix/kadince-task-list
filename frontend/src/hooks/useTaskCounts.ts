import { isDueToday, isOverdue } from '../lib/dates'
import type { Task } from '../types'
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
  return tasks ? tallyTasks(tasks) : undefined
}

export function tallyTasks(tasks: Task[]): TaskCounts {
  const completed = tasks.filter((t) => t.completed).length
  const today = tasks.filter(
    (t) => isOverdue(t) || (isDueToday(t) && !t.completed),
  ).length
  return { all: tasks.length, pending: tasks.length - completed, completed, today }
}
