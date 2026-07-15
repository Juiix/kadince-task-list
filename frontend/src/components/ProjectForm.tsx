import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateProject } from '../hooks/useProjectMutations'
import { PROJECT_COLORS, projectSchema, type ProjectFormValues } from '../lib/projectSchema'

interface ProjectFormProps {
  onSuccess?: () => void
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const createProject = useCreateProject()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', color: '3987e5' },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createProject.mutateAsync({
        name: values.name,
        color: values.color,
      })
      reset()
      onSuccess?.()
    } catch {
      // Server error is surfaced below via createProject.error
    }
  })

  return (
    <form className="task-form" onSubmit={onSubmit} noValidate>
      <input
        {...register('name')}
        type="text"
        placeholder="What's the project?"
        aria-label="Project name"
        aria-invalid={errors.name ? true : undefined}
        data-cy="project-name-input"
        autoFocus
      />
      {errors.name && <p className="field-error">{errors.name.message}</p>}

      <div className="swatch-row" role="radiogroup" aria-label="Project color">
        {PROJECT_COLORS.map((color) => (
            <label key={color} className="swatch">
                <input type="radio" value={color} {...register('color')} data-cy={`swatch-${color}`} />
                <span className="swatch-dot" style={{ backgroundColor: `#${color}` }} />
            </label>
        ))}
      </div>

      {createProject.isError && (
        <p className="field-error" role="alert">
          {createProject.error.message}
        </p>
      )}

      <button
        type="submit"
        className="btn primary"
        disabled={isSubmitting}
        data-cy="project-submit"
      >
        {isSubmitting ? 'Adding…' : 'Add project'}
      </button>
    </form>
  )
}
