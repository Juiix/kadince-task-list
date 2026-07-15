interface HeaderProps {
  title: string
  subtitle: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-text">
        <h1>{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>
    </header>
  )
}
