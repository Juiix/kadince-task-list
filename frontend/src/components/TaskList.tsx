import { useTasks } from '../hooks/useTasks'
import type { TaskFilter } from '../types'
import { TaskItem } from './TaskItem'

const GROUP_LABELS: Record<TaskFilter, string> = {
  ALL: 'My Tasks',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
}

const EMPTY_MESSAGES: Record<TaskFilter, string> = {
  ALL: 'No tasks yet. Add your first one.',
  PENDING: 'Nothing pending — nice work.',
  COMPLETED: 'No completed tasks yet.',
}

interface TaskListProps {
  filter: TaskFilter
  search: string
  onAdd: () => void
}

export function TaskList({ filter, search, onAdd }: TaskListProps) {
  const { data: tasks, isPending, isError, error } = useTasks(filter)

  if (isPending) {
    return <p className="status">Loading tasks…</p>
  }

  if (isError) {
    return (
      <p className="status error" role="alert">
        Couldn&apos;t load tasks: {error.message}
      </p>
    )
  }

  const query = search.trim().toLowerCase()
  const visibleTasks = query
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      )
    : tasks

  return (
    <section className="task-group" aria-label={GROUP_LABELS[filter]}>
      <header className="group-header">
        <span className="group-dot" aria-hidden="true" />
        <h2>{GROUP_LABELS[filter]}</h2>
        <span className="group-count">{visibleTasks.length}</span>
      </header>

      <div className="group-card">
        {visibleTasks.length === 0 ? (
          <p className="group-empty">
            {query ? 'No tasks match your search.' : EMPTY_MESSAGES[filter]}
          </p>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
        <button
          type="button"
          className="add-row"
          data-cy="add-task-inline"
          onClick={onAdd}
        >
          + Add task
        </button>
      </div>
    </section>
  )
}
