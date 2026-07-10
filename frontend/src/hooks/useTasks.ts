import { useQuery } from '@tanstack/react-query'
import { fetchTasks } from '../api/tasks'
import type { TaskFilter } from '../types'

export function useTasks(filter: TaskFilter) {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter),
  })
}
