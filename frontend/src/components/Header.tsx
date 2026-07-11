interface HeaderProps {
  pendingCount?: number
  onAddTask: () => void
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 18) return 'Good afternoon!'
  return 'Good evening!'
}

export function Header({ pendingCount, onAddTask }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>{greeting()} 👋</h1>
        <p className="header-subtitle">
          {pendingCount === undefined
            ? 'Loading your tasks…'
            : pendingCount === 0
              ? 'You’re all caught up.'
              : `You have ${pendingCount} pending ${pendingCount === 1 ? 'task' : 'tasks'}.`}
        </p>
      </div>
      <button
        type="button"
        className="btn primary"
        data-cy="add-task-button"
        onClick={onAddTask}
      >
        + Add Task
      </button>
    </header>
  )
}
