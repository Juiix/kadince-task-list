import { z } from 'zod'

export const PROJECT_COLORS = [
  '3987e5', '199e70', 'c98500', '008300', '9085e9', 'e66767',
] as const

export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255, '…'),
  color: z.enum(PROJECT_COLORS),
})

export type ProjectFormValues = z.infer<typeof projectSchema>