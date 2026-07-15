import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTask } from '../hooks/useTaskMutations'
import { useProjects } from '../hooks/useProjects'
import { taskSchema, type TaskFormValues } from '../lib/taskSchema'

interface TaskFormProps {
  onSuccess?: () => void
  defaultDueOn?: string
  defaultProjectId?: string
}

export function TaskForm({ onSuccess, defaultDueOn, defaultProjectId }: TaskFormProps) {
  const createTask = useCreateTask()
  const { data: projects } = useProjects('ACTIVE')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueOn: defaultDueOn ?? '',
      projectId: defaultProjectId ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createTask.mutateAsync({
        title: values.title,
        description: values.description || null,
        dueOn: values.dueOn || null,
        projectId: values.projectId || null,
      })
      reset()
      onSuccess?.()
    } catch {
      // Server error is surfaced below via createTask.error
    }
  })

  return (
    <form className="task-form" onSubmit={onSubmit} noValidate>
      <input
        {...register('title')}
        type="text"
        placeholder="What needs doing?"
        aria-label="Task title"
        aria-invalid={errors.title ? true : undefined}
        data-cy="task-title-input"
        autoFocus
      />
      {errors.title && <p className="field-error">{errors.title.message}</p>}

      <textarea
        {...register('description')}
        placeholder="Add a description (optional)"
        aria-label="Task description"
        rows={2}
        data-cy="task-description-input"
      />
      {errors.description && (
        <p className="field-error">{errors.description.message}</p>
      )}

      <label className="date-field">
        <span>Due date (optional)</span>
        <input type="date" {...register('dueOn')} data-cy="task-due-input" />
      </label>
      {errors.dueOn && <p className="field-error">{errors.dueOn.message}</p>}

      <label className="date-field">
        <span>Project (optional)</span>
        <select {...register('projectId')} data-cy="task-project-select">
          <option value="">No project</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      {createTask.isError && (
        <p className="field-error" role="alert">
          {createTask.error.message}
        </p>
      )}

      <button
        type="submit"
        className="btn primary"
        disabled={isSubmitting}
        data-cy="task-submit"
      >
        {isSubmitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
