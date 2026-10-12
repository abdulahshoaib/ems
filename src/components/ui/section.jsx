/**
 * Flat section: a small uppercase label (and optional action) over content.
 * Intentionally unboxed — the dashboard uses hairlines and whitespace rather
 * than bordered cards.
 */
export function Section({ title, description, action, children, className = '' }) {
  return (
    <section className={className}>
      {(title || action) && (
        <header className="mb-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <div className="flex flex-col gap-0.5">
            {title && <h2 className="d-label">{title}</h2>}
            {description && <p className="text-[12px] text-[var(--d-muted)]">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function List({ className = '', children }) {
  return (
    <ul className={`divide-y divide-[var(--d-line)] border-y border-[var(--d-line)] ${className}`}>
      {children}
    </ul>
  )
}
