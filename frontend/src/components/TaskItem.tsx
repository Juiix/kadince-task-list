import { useEffect, useRef, useState } from 'react'
import { useDeleteTask, useUpdateTask } from '../hooks/useTaskMutations'
import { formatDue, isDueToday, isOverdue } from '../lib/dates'
import type { Task } from '../types'
import { TaskEditForm } from './TaskEditForm'

function dueClass(task: Task): string {
  if (isOverdue(task)) return 'task-meta overdue'
  if (isDueToday(task)) return 'task-meta due-today'
  return 'task-meta'
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  useEffect(() => {
    if (!menuOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

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
          task.dueOn && (
            <span className={dueClass(task)} data-cy="task-due">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
                <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" />
              </svg>
              {isOverdue(task)
                ? `Overdue · ${formatDue(task.dueOn)}`
                : formatDue(task.dueOn)}
            </span>
          )
        )}

        {/* Desktop: inline icons revealed on hover */}
        <div className="task-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Edit "${task.title}"`}
            data-cy="task-edit"
            onClick={() => setIsEditing(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4l11-11a2.1 2.1 0 0 0-4-4L4 16v4Z" />
              <path d="m13.5 6.5 4 4" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-btn danger"
            aria-label={`Delete "${task.title}"`}
            data-cy="task-delete"
            disabled={deleteTask.isPending}
            onClick={handleDelete}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.5 6.5h15M9.5 6.5v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M7 6.5l1 13a1.5 1.5 0 0 0 1.5 1.4h5a1.5 1.5 0 0 0 1.5-1.4l1-13M10.2 10.5v6M13.8 10.5v6" />
            </svg>
          </button>
        </div>

        {/* Mobile: actions collapsed under a kebab menu */}
        <div className="task-menu" ref={menuRef}>
          <button
            type="button"
            className="icon-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`More options for "${task.title}"`}
            data-cy="task-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="5" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="12" cy="19" r="1.7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="menu" role="menu">
              <button
                type="button"
                role="menuitem"
                data-cy="task-menu-edit"
                onClick={() => {
                  setMenuOpen(false)
                  setIsEditing(true)
                }}
              >
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                className="danger"
                data-cy="task-menu-delete"
                disabled={deleteTask.isPending}
                onClick={() => {
                  setMenuOpen(false)
                  handleDelete()
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
