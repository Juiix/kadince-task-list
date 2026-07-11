import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TaskItem } from './TaskItem'
import { makeTask } from '../test/factories'
import { renderWithClient } from '../test/helpers'
import { todayISO } from '../lib/dates'
import * as api from '../api/tasks'

vi.mock('../api/tasks', () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('TaskItem', () => {
  it('shows title, description, and due date', () => {
    renderWithClient(
      <TaskItem
        task={makeTask({
          title: 'Water the plants',
          description: 'Just the ferns',
          dueOn: '2026-12-25',
        })}
      />,
    )

    expect(screen.getByText('Water the plants')).toBeInTheDocument()
    expect(screen.getByText('Just the ferns')).toBeInTheDocument()
    expect(screen.getByText(/Dec\s?25/)).toBeInTheDocument()
  })

  it('marks past-due tasks as overdue', () => {
    renderWithClient(<TaskItem task={makeTask({ dueOn: '2020-01-01' })} />)

    expect(screen.getByText(/Overdue/)).toBeInTheDocument()
  })

  it('shows Done instead of a date for completed tasks', () => {
    renderWithClient(
      <TaskItem task={makeTask({ completed: true, dueOn: todayISO() })} />,
    )

    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.queryByText('Today')).not.toBeInTheDocument()
  })

  it('toggles completion through the checkbox', async () => {
    const task = makeTask()
    vi.mocked(api.updateTask).mockResolvedValue({ ...task, completed: true })
    renderWithClient(<TaskItem task={task} />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(vi.mocked(api.updateTask).mock.calls[0][0]).toEqual({
      id: task.id,
      completed: true,
    })
  })

  it('deletes after the user confirms', async () => {
    const task = makeTask({ title: 'Doomed task' })
    vi.mocked(api.deleteTask).mockResolvedValue(task.id)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderWithClient(<TaskItem task={task} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete "Doomed task"' }),
    )

    expect(vi.mocked(api.deleteTask).mock.calls[0][0]).toBe(task.id)
  })

  it('does not delete when the user cancels the confirm', async () => {
    const task = makeTask({ title: 'Spared task' })
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderWithClient(<TaskItem task={task} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Delete "Spared task"' }),
    )

    expect(api.deleteTask).not.toHaveBeenCalled()
  })

  it('switches to the edit form via the edit button', async () => {
    renderWithClient(<TaskItem task={makeTask({ title: 'Editable' })} />)

    await userEvent.click(screen.getByRole('button', { name: 'Edit "Editable"' }))

    expect(screen.getByDisplayValue('Editable')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
