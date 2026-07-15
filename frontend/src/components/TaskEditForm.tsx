import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateTask } from '../hooks/useTaskMutations'
import { useProjects } from '../hooks/useProjects'
import { taskSchema, type TaskFormValues } from '../lib/taskSchema'
import type { Task } from '../types'

interface TaskEditFormProps {
  task: Task
  onClose: () => void
}

export function TaskEditForm({ task, onClose }: TaskEditFormProps) {
  const updateTask = useUpdateTask()
  const { data: projects } = useProjects('ACTIVE')
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      dueOn: task.dueOn ?? '',
      projectId: task.project?.id ?? '',
    },
  })
  const dueOn = watch('dueOn')

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        title: values.title,
        description: values.description || null,
        dueOn: values.dueOn || null,
        projectId: values.projectId || null,
      })
      onClose()
    } catch {
      // Server error is surfaced below via updateTask.error
    }
  })

  return (
    <form className="task-form edit" onSubmit={onSubmit} noValidate>
      <div className="field">
        <span className="field-label">
          Task title <em className="req" aria-hidden="true">*</em>
        </span>
        <input
          {...register('title')}
          type="text"
          aria-label="Task title"
          aria-invalid={errors.title ? true : undefined}
          data-cy="task-title-input"
          autoFocus
        />
        {errors.title && <p className="field-error">{errors.title.message}</p>}
      </div>

      <div className="field">
        <span className="field-label">
          Description <span className="optional">(optional)</span>
        </span>
        <textarea
          {...register('description')}
          placeholder="Add more details…"
          aria-label="Task description"
          rows={3}
        />
        {errors.description && (
          <p className="field-error">{errors.description.message}</p>
        )}
      </div>

      <div className="form-row">
        <div className="field">
          <span className="field-label">
            Project <span className="optional">(optional)</span>
          </span>
          <div className="control">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.5 6.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11.5Z" />
            </svg>
            <select {...register('projectId')} aria-label="Project (optional)" data-cy="task-project-select">
              <option value="">No project</option>
              {/* A completed project isn't in the active list; keep the task's own
                  project selectable so editing doesn't silently clear it. */}
              {task.project && !projects?.some((p) => p.id === task.project?.id) && (
                <option value={task.project.id}>{task.project.name} (completed)</option>
              )}
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <span className="field-label">
            Due date <span className="optional">(optional)</span>
          </span>
          <div className="control">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
              <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" />
            </svg>
            <input
              type="date"
              {...register('dueOn')}
              className={dueOn ? undefined : 'date-empty'}
              aria-label="Due date (optional)"
              data-cy="task-due-input"
            />
            {!dueOn && (
              <span className="date-placeholder" aria-hidden="true">
                Select a date
              </span>
            )}
            {dueOn && (
              <button
                type="button"
                className="control-clear"
                aria-label="Clear due date"
                data-cy="task-due-clear"
                onClick={() => setValue('dueOn', '', { shouldDirty: true })}
              >
                ×
              </button>
            )}
          </div>
          {errors.dueOn && <p className="field-error">{errors.dueOn.message}</p>}
        </div>
      </div>

      {updateTask.isError && (
        <p className="field-error" role="alert">
          {updateTask.error.message}
        </p>
      )}

      <div className="form-footer">
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
