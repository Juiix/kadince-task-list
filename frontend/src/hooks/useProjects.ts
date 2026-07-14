import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../api/projects'
import type { ProjectFilter } from '../types'

export function useProjects(filter: ProjectFilter) {
  return useQuery({
    queryKey: ['projects', filter],
    queryFn: () => fetchProjects(filter),
  })
}
