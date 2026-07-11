import type { Task } from '../types'
import { TaskItem } from './TaskItem'

interface TaskGroupProps {
  title: string
  tasks: Task[]
  emptyMessage: string
  tone?: 'default' | 'danger'
  showHeader?: boolean
}

export function TaskGroup({
  title,
  tasks,
  emptyMessage,
  tone = 'default',
  showHeader = true,
}: TaskGroupProps) {
  return (
    <section className="task-group" aria-label={title} data-cy="task-group">
      {showHeader && (
        <header className="group-header">
          <span
            className={tone === 'danger' ? 'group-dot danger' : 'group-dot'}
            aria-hidden="true"
          />
          <h2>{title}</h2>
          <span className="group-count">{tasks.length}</span>
        </header>
      )}

      <div className="group-card">
        {tasks.length === 0 ? (
          <p className="group-empty">{emptyMessage}</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
