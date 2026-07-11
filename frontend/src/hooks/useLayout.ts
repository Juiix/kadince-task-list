import { useOutletContext } from 'react-router-dom'

export interface LayoutContext {
  search: string
  setSearch: (value: string) => void
  openAddTask: (defaults?: { dueOn?: string }) => void
}

export function useLayout(): LayoutContext {
  return useOutletContext<LayoutContext>()
}
