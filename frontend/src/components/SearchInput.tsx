import { useLayout } from '../hooks/useLayout'

export function SearchInput() {
  const { search, setSearch } = useLayout()

  return (
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
  )
}
