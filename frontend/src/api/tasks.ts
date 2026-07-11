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

/** Shape of every mutation payload: user errors are data, not exceptions. */
interface TaskPayload {
  task: Task | null
  errors: string[]
}

function unwrap(payload: TaskPayload, fallbackMessage: string): Task {
  if (payload.errors.length > 0 || !payload.task) {
    throw new Error(payload.errors.join('; ') || fallbackMessage)
  }
  return payload.task
}

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

export interface CreateTaskInput {
  title: string
  description?: string | null
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const data = await graphqlRequest<{ createTask: TaskPayload }>(
    `mutation CreateTask($input: CreateTaskInput!) {
      createTask(input: $input) {
        task {
          ${TASK_FIELDS}
        }
        errors
      }
    }`,
    { input },
  )
  return unwrap(data.createTask, 'Failed to create task')
}

export interface UpdateTaskInput {
  id: string
  title?: string
  description?: string | null
  completed?: boolean
}

export async function updateTask(input: UpdateTaskInput): Promise<Task> {
  const data = await graphqlRequest<{ updateTask: TaskPayload }>(
    `mutation UpdateTask($input: UpdateTaskInput!) {
      updateTask(input: $input) {
        task {
          ${TASK_FIELDS}
        }
        errors
      }
    }`,
    { input },
  )
  return unwrap(data.updateTask, 'Failed to update task')
}

export async function deleteTask(id: string): Promise<string> {
  const data = await graphqlRequest<{ deleteTask: { id: string | null; errors: string[] } }>(
    `mutation DeleteTask($input: DeleteTaskInput!) {
      deleteTask(input: $input) {
        id
        errors
      }
    }`,
    { input: { id } },
  )
  const { id: deletedId, errors } = data.deleteTask
  if (errors.length > 0 || !deletedId) {
    throw new Error(errors.join('; ') || 'Failed to delete task')
  }
  return deletedId
}
