import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateTask } from '../hooks/useTaskMutations'
import { taskSchema, type TaskFormValues } from '../lib/taskSchema'
import type { Task } from '../types'

interface TaskEditFormProps {
  task: Task
  onClose: () => void
}

export function TaskEditForm({ task, onClose }: TaskEditFormProps) {
  const updateTask = useUpdateTask()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      dueOn: task.dueOn ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        title: values.title,
        description: values.description || null,
        dueOn: values.dueOn || null,
      })
      onClose()
    } catch {
      // Server error is surfaced below via updateTask.error
    }
  })

  return (
    <form className="task-form edit" onSubmit={onSubmit} noValidate>
      <input
        {...register('title')}
        type="text"
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
      />
      {errors.description && (
        <p className="field-error">{errors.description.message}</p>
      )}

      <label className="date-field">
        <span>Due date (optional)</span>
        <input type="date" {...register('dueOn')} data-cy="task-due-input" />
      </label>
      {errors.dueOn && <p className="field-error">{errors.dueOn.message}</p>}

      {updateTask.isError && (
        <p className="field-error" role="alert">
          {updateTask.error.message}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}
