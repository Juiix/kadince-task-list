import { useQuery } from '@tanstack/react-query'
import { fetchTasks } from '../api/tasks'
import type { TaskFilter, TaskSortMode } from '../types'

export function useTasks(filter: TaskFilter, sortMode: TaskSortMode) {
  return useQuery({
    queryKey: ['tasks', filter, sortMode],
    queryFn: () => fetchTasks(filter, sortMode),
  })
}
