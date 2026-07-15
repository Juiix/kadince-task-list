import { useOutletContext } from 'react-router-dom'

export interface TaskDefaults {
  dueOn?: string
  projectId?: string
}

export interface LayoutContext {
  search: string
  setSearch: (value: string) => void
  openAddTask: (defaults?: TaskDefaults) => void
}

export function useLayout(): LayoutContext {
  return useOutletContext<LayoutContext>()
}
