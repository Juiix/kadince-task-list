import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FilterTabs } from './FilterTabs'

describe('FilterTabs', () => {
  it('renders the three filters with counts', () => {
    render(
      <FilterTabs
        value="ALL"
        onChange={() => {}}
        counts={{ all: 5, pending: 3, completed: 2, today: 1 }}
      />,
    )

    expect(screen.getByRole('tab', { name: /All\s*5/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Pending\s*3/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Completed\s*2/ })).toBeInTheDocument()
  })

  it('marks the active filter as selected', () => {
    render(<FilterTabs value="PENDING" onChange={() => {}} />)

    expect(screen.getByRole('tab', { name: 'Pending' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('reports the clicked filter through onChange', async () => {
    const onChange = vi.fn()
    render(<FilterTabs value="ALL" onChange={onChange} />)

    await userEvent.click(screen.getByRole('tab', { name: 'Completed' }))

    expect(onChange).toHaveBeenCalledWith('COMPLETED')
  })
})
