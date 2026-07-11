import { useState } from 'react'
import { useDeleteTask, useUpdateTask } from '../hooks/useTaskMutations'
import type { Task } from '../types'
import { TaskEditForm } from './TaskEditForm'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
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
      <li className="task-item editing">
        <TaskEditForm task={task} onClose={() => setIsEditing(false)} />
      </li>
    )
  }

  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
        className="task-check"
        onClick={handleToggle}
        disabled={updateTask.isPending}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <p className="task-meta">
          Added {dateFormat.format(new Date(task.createdAt))}
        </p>
        {(updateTask.isError || deleteTask.isError) && (
          <p className="field-error" role="alert">
            {updateTask.error?.message ?? deleteTask.error?.message}
          </p>
        )}
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="btn small"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn small danger"
          onClick={handleDelete}
          disabled={deleteTask.isPending}
        >
          {deleteTask.isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </li>
  )
}
