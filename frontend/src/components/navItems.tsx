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
    label: 'Home',
    countKey: 'today',
    isActive: (pathname) => pathname === '/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5M6 10v9h4v-5h4v5h4v-9" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'Tasks',
    isActive: (pathname) => pathname === '/tasks',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3.5 5.5 1.5 1.5L7.5 4M3.5 12l1.5 1.5L7.5 10.5M3.5 18.5 5 20l2.5-3M11 6.5h9.5M11 13h9.5M11 19.5h9.5" />
      </svg>
    ),
  },
]
