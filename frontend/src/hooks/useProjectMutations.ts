import { useMutation } from '@tanstack/react-query'
import { completeProject, createProject, deleteProject, reopenProject, updateProject } from '../api/projects'
import { useInvalidate } from './useInvalidate'

export function useCreateProject() {
  const invalidate = useInvalidate('projects')
  return useMutation({ mutationFn: createProject, onSuccess: invalidate })
}

export function useUpdateProject() {
  const invalidate = useInvalidate('projects', 'tasks')
  return useMutation({ mutationFn: updateProject, onSuccess: invalidate })
}

export function useDeleteProject() {
  const invalidate = useInvalidate('projects', 'tasks')
  return useMutation({ mutationFn: deleteProject, onSuccess: invalidate })
}

export function useCompleteProject() {
  const invalidate = useInvalidate('projects', 'tasks')
  return useMutation({ mutationFn: completeProject, onSuccess: invalidate })
}

export function useReopenProject() {
  const invalidate = useInvalidate('projects')
  return useMutation({ mutationFn: reopenProject, onSuccess: invalidate })
}
