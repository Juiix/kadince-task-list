interface TopbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function Topbar({ search, onSearchChange }: TopbarProps) {
  return (
    <div className="topbar">
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
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <span className="avatar" aria-hidden="true">
        T
      </span>
    </div>
  )
}
