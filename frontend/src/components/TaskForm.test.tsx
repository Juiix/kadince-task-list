import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TaskForm } from './TaskForm'
import { makeTask } from '../test/factories'
import { renderWithClient } from '../test/helpers'
import * as api from '../api/tasks'

vi.mock('../api/tasks', () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('TaskForm', () => {
  it('shows a validation error and skips the API on an empty title', async () => {
    renderWithClient(<TaskForm />)

    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(api.createTask).not.toHaveBeenCalled()
  })

  it('creates a task and resets the form', async () => {
    vi.mocked(api.createTask).mockResolvedValue(makeTask({ title: 'New task' }))
    const onSuccess = vi.fn()
    renderWithClient(<TaskForm onSuccess={onSuccess} />)

    const titleInput = screen.getByLabelText('Task title')
    await userEvent.type(titleInput, 'New task')
    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(vi.mocked(api.createTask).mock.calls[0][0]).toEqual({
      title: 'New task',
      description: null,
      dueOn: null,
      projectId: null,
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(titleInput).toHaveValue('')
  })

  it('passes the optional due date through when provided', async () => {
    vi.mocked(api.createTask).mockResolvedValue(makeTask())
    renderWithClient(<TaskForm defaultDueOn="2026-08-01" />)

    await userEvent.type(screen.getByLabelText('Task title'), 'Dated task')
    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(vi.mocked(api.createTask).mock.calls[0][0]).toEqual({
      title: 'Dated task',
      description: null,
      dueOn: '2026-08-01',
      projectId: null,
    })
  })

  it('surfaces server errors from the mutation payload', async () => {
    vi.mocked(api.createTask).mockRejectedValue(
      new Error("Title can't be blank"),
    )
    renderWithClient(<TaskForm />)

    await userEvent.type(screen.getByLabelText('Task title'), 'Fails on server')
    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Title can't be blank",
    )
  })
})
