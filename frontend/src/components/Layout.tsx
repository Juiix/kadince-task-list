import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Modal } from './Modal'
import { Sidebar } from './Sidebar'
import { TaskForm } from './TaskForm'
import { useTaskCounts } from '../hooks/useTaskCounts'
import type { LayoutContext } from '../hooks/useLayout'

export function Layout() {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState<{ dueOn?: string } | null>(null)
  const counts = useTaskCounts()

  const context: LayoutContext = {
    search,
    setSearch,
    openAddTask: (defaults) => setAdding(defaults ?? {}),
  }

  return (
    <div className="layout">
      <Sidebar counts={counts} />

      <main className="main">
        <Outlet context={context} />
      </main>

      {adding && (
        <Modal title="Add Task" onClose={() => setAdding(null)}>
          <TaskForm defaultDueOn={adding.dueOn} onSuccess={() => setAdding(null)} />
        </Modal>
      )}
    </div>
  )
}
