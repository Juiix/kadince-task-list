import { useState } from 'react'
import { FilterTabs } from './components/FilterTabs'
import { Header } from './components/Header'
import { Modal } from './components/Modal'
import { Sidebar } from './components/Sidebar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { Topbar } from './components/Topbar'
import { useTaskCounts } from './hooks/useTaskCounts'
import type { TaskFilter } from './types'

function App() {
  const [filter, setFilter] = useState<TaskFilter>('ALL')
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const counts = useTaskCounts()

  return (
    <div className="layout">
      <Sidebar filter={filter} onChange={setFilter} counts={counts} />

      <div className="content">
        <Topbar search={search} onSearchChange={setSearch} />

        <main className="main">
          <Header pendingCount={counts?.pending} onAddTask={() => setIsAdding(true)} />
          <FilterTabs value={filter} onChange={setFilter} counts={counts} />
          <TaskList filter={filter} search={search} onAdd={() => setIsAdding(true)} />
        </main>
      </div>

      {isAdding && (
        <Modal title="Add Task" onClose={() => setIsAdding(false)}>
          <TaskForm onSuccess={() => setIsAdding(false)} />
        </Modal>
      )}
    </div>
  )
}

export default App
