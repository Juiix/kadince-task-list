import { Header } from '../components/Header'
import { TaskGroup } from '../components/TaskGroup'
import { useTasks } from '../hooks/useTasks'
import { byDueDate, isDueToday, isOverdue } from '../lib/dates'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 18) return 'Good afternoon!'
  return 'Good evening!'
}

function subtitle(overdueCount: number, dueTodayCount: number): string {
  if (overdueCount > 0) {
    return `You have ${overdueCount} overdue and ${dueTodayCount} due today.`
  }
  if (dueTodayCount > 0) {
    return `You have ${dueTodayCount} ${dueTodayCount === 1 ? 'task' : 'tasks'} due today.`
  }
  return 'Nothing due today — you’re all clear.'
}

export function TodayPage() {
  const { data: tasks, isPending, isError, error } = useTasks('ALL')

  if (isPending) {
    return <p className="status">Loading tasks…</p>
  }

  if (isError) {
    return (
      <p className="status error" role="alert">
        Couldn&apos;t load tasks: {error.message}
      </p>
    )
  }

  const overdue = tasks.filter(isOverdue).sort(byDueDate)
  const dueToday = tasks.filter(isDueToday)
  const pendingToday = dueToday.filter((task) => !task.completed).length

  return (
    <>
      <Header
        title={`${greeting()} 👋`}
        subtitle={subtitle(overdue.length, pendingToday)}
      />

      {overdue.length > 0 && (
        <TaskGroup
          title="Overdue"
          tone="danger"
          tasks={overdue}
          emptyMessage=""
        />
      )}

      <TaskGroup title="Today" tasks={dueToday} emptyMessage="Nothing due today." />
    </>
  )
}
