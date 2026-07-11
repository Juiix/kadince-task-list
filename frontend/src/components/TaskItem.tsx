import { useState } from 'react'
import { useDeleteTask, useUpdateTask } from '../hooks/useTaskMutations'
import type { Task } from '../types'
import { TaskEditForm } from './TaskEditForm'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const handleToggle = () => {
    updateTask.mutate({ id: task.id, completed: !task.completed })
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask.mutate(task.id)
    }
  }

  if (isEditing) {
    return (
      <li className="task-item editing" data-cy="task-row">
        <TaskEditForm task={task} onClose={() => setIsEditing(false)} />
      </li>
    )
  }

  return (
    <li
      className={task.completed ? 'task-item completed' : 'task-item'}
      data-cy="task-row"
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
        className="task-check"
        data-cy="task-checkbox"
        onClick={handleToggle}
        disabled={updateTask.isPending}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6.5 12.5 4 4 7-9" />
        </svg>
      </button>

      <div className="task-body">
        <p className="task-title" data-cy="task-title">
          {task.title}
        </p>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {(updateTask.isError || deleteTask.isError) && (
          <p className="field-error" role="alert">
            {updateTask.error?.message ?? deleteTask.error?.message}
          </p>
        )}
      </div>

      <div className="task-side">
        {task.completed ? (
          <span className="done-text">Done</span>
        ) : (
          <span className="task-meta">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
              <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" />
            </svg>
            {dateFormat.format(new Date(task.createdAt))}
          </span>
        )}
        <div className="task-actions">
          <button
            type="button"
            className="btn small"
            data-cy="task-edit"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn small danger"
            data-cy="task-delete"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
          >
            {deleteTask.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </li>
  )
}
