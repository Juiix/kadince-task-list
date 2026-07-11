import { useLayout } from '../hooks/useLayout'

interface HeaderProps {
  title: string
  subtitle: string
  showSearch?: boolean
  onAddTask?: () => void
}

export function Header({ title, subtitle, showSearch = false, onAddTask }: HeaderProps) {
  const { search, setSearch } = useLayout()

  return (
    <header className="header">
      <div className="header-text">
        <h1>{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-actions">
        {showSearch && (
          <div className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              placeholder="Search tasks…"
              aria-label="Search tasks"
              data-cy="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        )}
        {onAddTask && (
          <button
            type="button"
            className="btn primary"
            data-cy="add-task-button"
            onClick={onAddTask}
          >
            + Add Task
          </button>
        )}
        <span className="avatar" aria-hidden="true">
          T
        </span>
      </div>
    </header>
  )
}
