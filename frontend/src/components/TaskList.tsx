import { useTasks } from '../hooks/useTasks'
import type { TaskFilter } from '../types'
import { TaskItem } from './TaskItem'

const EMPTY_MESSAGES: Record<TaskFilter, string> = {
  ALL: 'No tasks yet. Add your first one above.',
  PENDING: 'Nothing pending — nice work.',
  COMPLETED: 'No completed tasks yet.',
}

interface TaskListProps {
  filter: TaskFilter
}

export function TaskList({ filter }: TaskListProps) {
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

  if (tasks.length === 0) {
    return <p className="status">{EMPTY_MESSAGES[filter]}</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
