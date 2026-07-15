import { describe, expect, it } from 'vitest'
import { PROJECT_COLORS, projectSchema } from './projectSchema'

const valid = { name: 'Build todo list app', color: '3987e5' }

describe('projectSchema', () => {
  it('accepts a name and color from palette', () => {
    expect(projectSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a blank or whitespace-only name', () => {
    expect(projectSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
    expect(projectSchema.safeParse({ ...valid, name: '   ' }).success).toBe(false)
  })

  it('rejects a name over 255 characters', () => {
    expect(projectSchema.safeParse({ ...valid, name: 'a'.repeat(256) }).success).toBe(false)
  })

  it('accepts colors from palette and rejects others', () => {
    PROJECT_COLORS.forEach(color => {
        expect(projectSchema.safeParse({ ...valid, color: color }).success).toBe(true)
    })
    expect(projectSchema.safeParse({ ...valid, color: 'ffffff' }).success).toBe(false)
    expect(projectSchema.safeParse({ ...valid, color: 'zzzzzz' }).success).toBe(false)
    expect(projectSchema.safeParse({ name: 'x' }).success).toBe(false)
  })
})
