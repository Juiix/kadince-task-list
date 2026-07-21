import type { TaskSortMode } from '../types'

const SORT_MODES: { value: TaskSortMode; label: string; }[] = [
  { value: 'DUEDATE', label: 'Due Date' },
  { value: 'ALPHABETICAL', label: 'A-Z' },
]

interface SortTabsProps {
  value: TaskSortMode
  onChange: (filter: TaskSortMode) => void
}

export function SortTabs({ value, onChange }: SortTabsProps) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
      {SORT_MODES.map((sortMode) => (
        <button
          key={sortMode.value}
          type="button"
          role="tab"
          aria-selected={value === sortMode.value}
          className={value === sortMode.value ? 'filter-tab active' : 'filter-tab'}
          data-cy={`sort-${sortMode.value.toLowerCase()}`}
          onClick={() => onChange(sortMode.value)}
        >
          {sortMode.label}
        </button>
      ))}
    </div>
  )
}
