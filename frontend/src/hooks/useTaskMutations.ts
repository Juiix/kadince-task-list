import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, updateTask } from '../api/tasks'

/**
 * All task mutations invalidate every ['tasks', *] cache entry on success,
 * so each filtered list refetches and stays consistent with the server.
 */
function useInvalidateTasks() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks()
  return useMutation({ mutationFn: createTask, onSuccess: invalidate })
}

export function useUpdateTask() {
  const invalidate = useInvalidateTasks()
  return useMutation({ mutationFn: updateTask, onSuccess: invalidate })
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks()
  return useMutation({ mutationFn: deleteTask, onSuccess: invalidate })
}
