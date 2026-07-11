import type { ReactNode } from 'react'
import type { TaskCounts } from '../hooks/useTaskCounts'

export interface NavItem {
  to: string
  label: string
  countKey?: keyof TaskCounts
  isActive: (pathname: string) => boolean
  icon: ReactNode
}

export const NAV_ITEMS: NavItem[] = [
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
    label: 'Tasks',
    isActive: (pathname) => pathname === '/tasks',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5M6 10v9h4v-5h4v5h4v-9" />
      </svg>
    ),
  },
]
