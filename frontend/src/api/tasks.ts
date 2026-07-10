import { graphqlRequest } from '../lib/graphql'
import type { Task, TaskFilter } from '../types'

const TASK_FIELDS = `
  id
  title
  description
  completed
  createdAt
  updatedAt
`

export async function fetchTasks(filter: TaskFilter): Promise<Task[]> {
  const data = await graphqlRequest<{ tasks: Task[] }>(
    `query Tasks($filter: TaskFilter) {
      tasks(filter: $filter) {
        ${TASK_FIELDS}
      }
    }`,
    { filter },
  )
  return data.tasks
}
