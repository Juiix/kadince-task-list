import { describe, expect, it } from 'vitest'
import { taskSchema } from './taskSchema'

const valid = { title: 'Write tests', description: '', dueOn: '' }

describe('taskSchema', () => {
  it('accepts a title with empty description and due date', () => {
    expect(taskSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a blank or whitespace-only title', () => {
    expect(taskSchema.safeParse({ ...valid, title: '' }).success).toBe(false)
    expect(taskSchema.safeParse({ ...valid, title: '   ' }).success).toBe(false)
  })

  it('rejects a title over 255 characters', () => {
    expect(taskSchema.safeParse({ ...valid, title: 'a'.repeat(256) }).success).toBe(false)
  })

  it('accepts an ISO due date and rejects other formats', () => {
    expect(taskSchema.safeParse({ ...valid, dueOn: '2026-07-15' }).success).toBe(true)
    expect(taskSchema.safeParse({ ...valid, dueOn: '07/15/2026' }).success).toBe(false)
  })
})
