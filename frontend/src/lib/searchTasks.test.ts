import { describe, expect, it } from 'vitest'
import { searchTasks } from './searchTasks'
import { makeTask } from '../test/factories'

describe('searchTasks', () => {
  const groceries = makeTask({ title: 'Buy groceries', description: 'milk and eggs' })
  const taxes = makeTask({ title: 'File taxes', description: null })
  const tasks = [groceries, taxes]

  it('returns everything for a blank or whitespace query', () => {
    expect(searchTasks(tasks, '')).toEqual(tasks)
    expect(searchTasks(tasks, '   ')).toEqual(tasks)
  })

  it('matches titles case-insensitively', () => {
    expect(searchTasks(tasks, 'TAXES')).toEqual([taxes])
  })

  it('matches descriptions', () => {
    expect(searchTasks(tasks, 'milk')).toEqual([groceries])
  })

  it('returns nothing when no task matches', () => {
    expect(searchTasks(tasks, 'zebra')).toEqual([])
  })
})
