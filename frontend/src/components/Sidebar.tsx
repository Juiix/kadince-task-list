import { Link, useLocation, useSearchParams } from 'react-router-dom'
import type { TaskCounts } from '../hooks/useTaskCounts'

interface NavItem {
  to: string
  label: string
  countKey: keyof TaskCounts
  isActive: (pathname: string, filter: string | null) => boolean
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Today',
    countKey: 'today',
    isActive: (pathname) => pathname === '/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
        <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3M12 13.5v4M10 15.5h4" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'My Tasks',
    countKey: 'all',
    isActive: (pathname, filter) => pathname === '/tasks' && filter === null,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5M6 10v9h4v-5h4v5h4v-9" />
      </svg>
    ),
  },
  {
    to: '/tasks?filter=pending',
    label: 'Pending',
    countKey: 'pending',
    isActive: (pathname, filter) => pathname === '/tasks' && filter === 'pending',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
      </svg>
    ),
  },
  {
    to: '/tasks?filter=completed',
    label: 'Completed',
    countKey: 'completed',
    isActive: (pathname, filter) => pathname === '/tasks' && filter === 'completed',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
      </svg>
    ),
  },
]

interface SidebarProps {
  counts?: TaskCounts
}

export function Sidebar({ counts }: SidebarProps) {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m6.5 12.5 4 4 7-9" />
          </svg>
        </span>
        <span className="brand-name">Task List</span>
      </div>

      <nav aria-label="Task views">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname, filter)
          return (
            <Link
              key={item.label}
              to={item.to}
              className={active ? 'nav-item active' : 'nav-item'}
              aria-current={active ? 'page' : undefined}
              data-cy={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {counts && <span className="nav-count">{counts[item.countKey]}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="side-section">
        <p className="side-heading">Projects</p>
        <p className="side-soon">Coming soon</p>
      </div>

      <div className="side-section">
        <p className="side-heading">Tags</p>
        <p className="side-soon">Coming soon</p>
      </div>

      <div className="side-footer">
        <button type="button" className="nav-item" disabled title="Coming soon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
          </svg>
          <span>Settings</span>
        </button>
        <button type="button" className="nav-item" disabled title="Coming soon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M9.6 9.2a2.5 2.5 0 0 1 4.8 1c0 1.6-2.4 2-2.4 3.3M12 16.8h.01" />
          </svg>
          <span>Help &amp; Feedback</span>
        </button>
      </div>
    </aside>
  )
}
