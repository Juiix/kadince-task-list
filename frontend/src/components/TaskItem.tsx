import type { Task } from '../types'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <span className="task-check" aria-hidden="true">
        {task.completed ? '✓' : ''}
      </span>
      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <p className="task-meta">
          Added {dateFormat.format(new Date(task.createdAt))}
        </p>
      </div>
    </li>
  )
}
