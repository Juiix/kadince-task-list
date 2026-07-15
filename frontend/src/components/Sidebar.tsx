import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import type { TaskCounts } from '../hooks/useTaskCounts'
import { useProjects } from '../hooks/useProjects'
import { useState } from 'react'
import { Modal } from './Modal'
import { ProjectForm } from './ProjectForm'

interface SidebarProps {
  counts?: TaskCounts
}

export function Sidebar({ counts }: SidebarProps) {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const activeProjectId = searchParams.get('project')
  const { data: projects } = useProjects('ACTIVE')
  const [addingProject, setAddingProject] = useState(false)

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
          const active = item.isActive(pathname) && !activeProjectId
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
              {counts && item.countKey && (
                <span className="nav-count">{counts[item.countKey]}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="side-section">
        <div className="side-heading-row">
          <p className="side-heading">Projects</p>
          <button type="button" className="icon-btn" aria-label="Add Project" data-cy="add-project-button" onClick={() => setAddingProject(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <nav aria-label="Projects">
          {projects?.map((project) => {
            const active = activeProjectId == project.id
            return (
              <Link
                key={project.id}
                to={`/tasks?project=${project.id}`}
                className={active ? 'nav-item active' : 'nav-item'}
                data-cy="project-row"
              >
                <span className="project-dot" style={{ backgroundColor: `#${project.color}` }} aria-hidden="true" />
                <span className="project-name">{project.name}</span>
              </Link>
            )
          })}
        </nav>
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

      {addingProject && (
        <Modal
          title="Create Project"
          subtitle="Organize your tasks by project."
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M3.5 6.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11.5Z" />
            </svg>
          }
          onClose={() => setAddingProject(false)}
        >
          <ProjectForm onSuccess={() => setAddingProject(false)} onCancel={() => setAddingProject(false)} />
        </Modal>
      )}
    </aside>
  )
}
