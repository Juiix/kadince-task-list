import { useMutation } from '@tanstack/react-query'
import { createTask, deleteTask, updateTask } from '../api/tasks'
import { useInvalidate } from './useInvalidate'

export function useCreateTask() {
  const invalidate = useInvalidate('tasks')
  return useMutation({ mutationFn: createTask, onSuccess: invalidate })
}

export function useUpdateTask() {
  const invalidate = useInvalidate('tasks')
  return useMutation({ mutationFn: updateTask, onSuccess: invalidate })
}

export function useDeleteTask() {
  const invalidate = useInvalidate('tasks')
  return useMutation({ mutationFn: deleteTask, onSuccess: invalidate })
}
