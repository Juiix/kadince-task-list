import type { Task } from '../types'

let nextId = 1

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: String(nextId++),
    title: 'A test task',
    description: null,
    completed: false,
    dueOn: null,
    createdAt: '2026-07-01T12:00:00Z',
    updatedAt: '2026-07-01T12:00:00Z',
    ...overrides,
    project: overrides.project ?? null,
  }
}
