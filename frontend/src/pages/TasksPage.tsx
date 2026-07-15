import { useSearchParams } from 'react-router-dom'
import { FilterTabs } from '../components/FilterTabs'
import { Header } from '../components/Header'
import { SearchInput } from '../components/SearchInput'
import { useLayout } from '../hooks/useLayout'
import { TaskGroup } from '../components/TaskGroup'
import { tallyTasks } from '../hooks/useTaskCounts'
import { useTasks } from '../hooks/useTasks'
import { searchTasks } from '../lib/searchTasks'
import type { Task, TaskFilter } from '../types'

const GROUP_LABELS: Record<TaskFilter, string> = {
  ALL: 'Tasks',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
}

const EMPTY_MESSAGES: Record<TaskFilter, string> = {
  ALL: 'No tasks yet. Add your first one.',
  PENDING: 'Nothing pending — nice work.',
  COMPLETED: 'No completed tasks yet.',
}

function parseFilter(value: string | null): TaskFilter {
  const upper = value?.toUpperCase()
  return upper === 'PENDING' || upper === 'COMPLETED' ? upper : 'ALL'
}

export function TasksPage() {
  const { search, openAddTask } = useLayout()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = parseFilter(searchParams.get('filter'))
  const projectId = searchParams.get('project')
  const { data: allTasks } = useTasks('ALL')
  const { data: tasks, isPending, isError, error } = useTasks(filter)

  const setFilter = (next: TaskFilter) => {
    setSearchParams((params) => {
      if (next === 'ALL') {
        params.delete('filter')
      } else {
        params.set('filter', next.toLowerCase())
      }
      return params
    })
  }

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

  const narrow = (list: Task[]) =>
  searchTasks(list, search).filter(
    (t) => !projectId || t.project?.id === projectId,
  )

  const counts = allTasks ? tallyTasks(narrow(allTasks)) : undefined
  const visible = narrow(tasks)

  return (
    <>
      <Header title="Tasks" subtitle="Everything in one place." />
      <div className="toolbar">
        <FilterTabs value={filter} onChange={setFilter} counts={counts} />
        <div className="toolbar-actions">
          <SearchInput />
          <button
            type="button"
            className="btn primary"
            data-cy="add-task-button"
            onClick={() => openAddTask()}
          >
            + Add Task
          </button>
        </div>
      </div>
      <TaskGroup
        title={GROUP_LABELS[filter]}
        tasks={visible}
        showHeader={false}
        emptyMessage={
          search ? 'No tasks match your search.' : EMPTY_MESSAGES[filter]
        }
      />
    </>
  )
}
