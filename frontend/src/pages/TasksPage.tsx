import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterTabs } from '../components/FilterTabs'
import { Header } from '../components/Header'
import { ProjectBanner } from '../components/ProjectBanner'
import { SearchInput } from '../components/SearchInput'
import { useLayout } from '../hooks/useLayout'
import { TaskGroup } from '../components/TaskGroup'
import { tallyTasks } from '../hooks/useTaskCounts'
import { useProjects } from '../hooks/useProjects'
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
  // ALL (not ACTIVE): the banner must keep rendering after the project is
  // completed while filtered to it, so Reopen stays reachable.
  const { data: projects } = useProjects('ALL')
  const project = projectId
    ? projects?.find((p) => p.id === projectId)
    : undefined

  // Self-heal the URL: if it names a project that no longer exists
  // (deleted here or elsewhere, stale bookmark), drop the filter.
  useEffect(() => {
    if (projectId && projects && !projects.some((p) => p.id === projectId)) {
      setSearchParams((params) => {
        params.delete('project')
        return params
      })
    }
  }, [projectId, projects, setSearchParams])

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
            onClick={() => openAddTask(project && !project.completed ? { projectId: project.id } : undefined)}
          >
            + Add Task
          </button>
        </div>
      </div>
      {project && (
        <ProjectBanner
          project={project}
          pendingCount={counts?.pending ?? 0}
          taskCount={counts?.all ?? 0}
        />
      )}
      <TaskGroup
        title={GROUP_LABELS[filter]}
        tasks={visible}
        showHeader={false}
        emptyMessage={
          search
            ? 'No tasks match your search.'
            : project
              ? 'No tasks in this project yet.'
              : EMPTY_MESSAGES[filter]
        }
      />
    </>
  )
}
