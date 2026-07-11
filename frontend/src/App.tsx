import { useState } from 'react'
import { FilterTabs } from './components/FilterTabs'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import type { TaskFilter } from './types'

function App() {
  const [filter, setFilter] = useState<TaskFilter>('ALL')

  return (
    <main className="app">
      <header className="app-header">
        <h1>Task List</h1>
        <p className="app-subtitle">Stay on top of what needs doing.</p>
      </header>
      <TaskForm />
      <FilterTabs value={filter} onChange={setFilter} />
      <TaskList filter={filter} />
    </main>
  )
}

export default App
