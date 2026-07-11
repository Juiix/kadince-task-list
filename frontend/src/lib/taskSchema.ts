import { z } from 'zod'

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be 2000 characters or fewer'),
})

export type TaskFormValues = z.infer<typeof taskSchema>
