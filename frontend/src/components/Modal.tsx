import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  onClose: () => void
  children: ReactNode
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24">
    <path d="m6.5 12.5 4 4 7-9" />
  </svg>
)

export function Modal({ title, subtitle, icon, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-cy="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-mark" aria-hidden="true">
            {icon ?? DEFAULT_ICON}
          </span>
          <div className="modal-heading">
            <h2>{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
