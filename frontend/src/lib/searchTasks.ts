import type { Task } from '../types'

export function searchTasks(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase()
  if (!q) return tasks
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q),
  )
}
