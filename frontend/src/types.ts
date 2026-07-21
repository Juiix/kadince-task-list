export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueOn: string | null
  project: Pick<Project, 'id' | 'name' | 'color'> | null
  createdAt: string
  updatedAt: string
}

export type TaskFilter = 'ALL' | 'PENDING' | 'COMPLETED'
export type TaskSortMode = 'ALPHABETICAL' | 'DUEDATE'

export interface Project {
  id: string
  name: string
  color: string
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectFilter = 'ALL' | 'ACTIVE' | 'COMPLETED'
