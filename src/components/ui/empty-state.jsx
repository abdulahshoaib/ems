export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border-y border-dashed border-[var(--d-line-strong)] px-4 py-10 text-center ${className}`}
    >
      {icon && <span className="mb-1 text-[var(--d-subtle)]">{icon}</span>}
      <p className="text-[13px] font-medium text-[var(--d-text)]">{title}</p>
      {description && (
        <p className="max-w-sm text-[12.5px] text-[var(--d-muted)]">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', description, onRetry, className = '' }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-start gap-1 border-l-2 border-[var(--d-danger)] pl-3 py-1.5 ${className}`}
    >
      <p className="text-[13px] font-medium text-[var(--d-danger)]">{title}</p>
      {description && <p className="text-[12.5px] text-[var(--d-muted)]">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="d-focus mt-2 inline-flex h-7 items-center rounded-md border border-[var(--d-line-strong)] px-2.5 text-[12.5px] font-medium text-[var(--d-text)] hover:bg-white/[0.06]"
        >
          Try again
        </button>
      )}
    </div>
  )
}
