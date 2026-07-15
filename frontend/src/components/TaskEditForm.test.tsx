import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeProject, makeTask } from '../test/factories'
import * as api from '../api/projects'
import * as tasksApi from '../api/tasks'
import { renderWithClient } from '../test/helpers'
import { TaskEditForm } from './TaskEditForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/projects', () => ({
  fetchProjects: vi.fn(),
}))

vi.mock('../api/tasks', () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('TaskEditForm', () => {
    it('keeps a completed project selectable and selected', async () => {
        const doghouse = makeProject({ name: 'Doghouse', completed: true })
        vi.mocked(api.fetchProjects).mockResolvedValue([makeProject({ name: 'Active One' })])
        const task = makeTask({ project: doghouse })

        renderWithClient(<TaskEditForm task={task} onClose={vi.fn()} />)

        const select = screen.getByLabelText('Project (optional)')
        expect(await screen.findByRole('option', { name: 'Active One' })).toBeInTheDocument()

        expect(screen.getByRole('option', { name: 'Doghouse (completed)' })).toBeInTheDocument()
        expect(select).toHaveValue(doghouse.id)
    })

    it('sends projectId null when no project is chosen', async () => {
        const active = makeProject({ name: 'Active One' })
        vi.mocked(api.fetchProjects).mockResolvedValue([active])
        vi.mocked(tasksApi.updateTask).mockResolvedValue(makeTask())
        const onClose = vi.fn()
        const task = makeTask({ project: active })

        renderWithClient(<TaskEditForm task={task} onClose={onClose} />)
        const select = screen.getByLabelText('Project (optional)')
        await screen.findByRole('option', { name: 'Active One' })
        
        await userEvent.selectOptions(select, '')
        await userEvent.click(screen.getByRole('button', { name: 'Save' }))

        expect(vi.mocked(tasksApi.updateTask).mock.calls[0][0]).toEqual(
            expect.objectContaining({ id: task.id, projectId: null }),
        )
        expect(onClose).toHaveBeenCalled()
    })

    it('renders active projects in the projects select', async () => {
        const actives = [
            makeProject({ name: 'Active One' }),
            makeProject({ name: 'Active Two' })
        ]
        vi.mocked(api.fetchProjects).mockResolvedValue(actives)
        const task = makeTask()

        renderWithClient(<TaskEditForm task={task} onClose={vi.fn()} />)

        expect(await screen.findByRole('option', { name: 'Active One' })).toBeInTheDocument()
        expect(await screen.findByRole('option', { name: 'Active Two' })).toBeInTheDocument()
    })
})