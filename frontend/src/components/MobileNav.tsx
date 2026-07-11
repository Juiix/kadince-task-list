import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import type { TaskCounts } from '../hooks/useTaskCounts'

interface MobileNavProps {
  counts?: TaskCounts
}

export function MobileNav({ counts }: MobileNavProps) {
  const { pathname } = useLocation()

  return (
    <nav className="mobile-nav" aria-label="Task views">
      {NAV_ITEMS.map((item) => {
        const active = item.isActive(pathname)
        return (
          <Link
            key={item.label}
            to={item.to}
            className={active ? 'mobile-nav-item active' : 'mobile-nav-item'}
            aria-current={active ? 'page' : undefined}
            data-cy={`mobile-nav-${item.label.toLowerCase()}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {counts && item.countKey !== undefined && counts[item.countKey] > 0 && (
              <span className="mobile-nav-count">{counts[item.countKey]}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
