import type { TaskFilter } from '../types'
import type { TaskCounts } from '../hooks/useTaskCounts'

const FILTERS: { value: TaskFilter; label: string; countKey: keyof TaskCounts }[] = [
  { value: 'ALL', label: 'All', countKey: 'all' },
  { value: 'PENDING', label: 'Pending', countKey: 'pending' },
  { value: 'COMPLETED', label: 'Completed', countKey: 'completed' },
]

interface FilterTabsProps {
  value: TaskFilter
  onChange: (filter: TaskFilter) => void
  counts?: TaskCounts
}

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={value === filter.value}
          className={value === filter.value ? 'filter-tab active' : 'filter-tab'}
          data-cy={`filter-${filter.value.toLowerCase()}`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
          {counts && <span className="tab-count">{counts[filter.countKey]}</span>}
        </button>
      ))}
    </div>
  )
}
