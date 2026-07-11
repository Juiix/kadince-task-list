import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTask } from '../hooks/useTaskMutations'
import { taskSchema, type TaskFormValues } from '../lib/taskSchema'

export function TaskForm() {
  const createTask = useCreateTask()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createTask.mutateAsync({
        title: values.title,
        description: values.description || null,
      })
      reset()
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

      {createTask.isError && (
        <p className="field-error" role="alert">
          {createTask.error.message}
        </p>
      )}

      <button type="submit" className="btn primary" disabled={isSubmitting}>
        {isSubmitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
