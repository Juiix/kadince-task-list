import { useCompleteProject, useDeleteProject, useReopenProject } from '../hooks/useProjectMutations'
import type { Project } from '../types'

interface ProjectBannerProps {
  project: Project
  pendingCount: number
  taskCount: number
}

export function ProjectBanner({ project, pendingCount, taskCount }: ProjectBannerProps) {
  const completeProject = useCompleteProject()
  const reopenProject = useReopenProject()
  const deleteProject = useDeleteProject()

  const handleComplete = () => {
    const confirmed =
      pendingCount === 0 ||
      window.confirm(
        `Complete "${project.name}"? ${pendingCount} pending ${pendingCount === 1 ? 'task' : 'tasks'} will be completed.`,
      )
    if (confirmed) completeProject.mutate(project.id)
  }

  const handleDelete = () => {
    const message =
      taskCount === 0
        ? `Delete "${project.name}"?`
        : `Delete "${project.name}" and its ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'}?`
    if (window.confirm(message)) {
      deleteProject.mutate(project.id)
    }
  }

  const error = completeProject.error ?? reopenProject.error ?? deleteProject.error

  return (
    <div className="project-banner" data-cy="project-banner">
      <span
        className="project-dot"
        style={{ backgroundColor: `#${project.color}` }}
        aria-hidden="true"
      />
      <h2>{project.name}</h2>
      {project.completed && <span className="done-text">Completed</span>}

      <div className="project-banner-actions">
        {project.completed ? (
          <button
            type="button"
            className="btn small"
            data-cy="project-reopen"
            disabled={reopenProject.isPending}
            onClick={() => reopenProject.mutate(project.id)}
          >
            Reopen
          </button>
        ) : (
          <button
            type="button"
            className="btn small"
            data-cy="project-complete"
            disabled={completeProject.isPending}
            onClick={handleComplete}
          >
            Complete
          </button>
        )}
        <button
          type="button"
          className="btn small danger"
          data-cy="project-delete"
          disabled={deleteProject.isPending}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
