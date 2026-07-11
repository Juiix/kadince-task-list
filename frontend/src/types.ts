export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueOn: string | null
  createdAt: string
  updatedAt: string
}

export type TaskFilter = 'ALL' | 'PENDING' | 'COMPLETED'
