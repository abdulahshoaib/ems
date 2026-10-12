const TONES = {
  neutral: 'bg-white/[0.07] text-[var(--d-muted)]',
  dim: 'border border-[var(--d-line)] text-[var(--d-subtle)]',
  ok: 'bg-[var(--d-ok-soft)] text-[var(--d-ok)]',
  warn: 'bg-[var(--d-warn-soft)] text-[var(--d-warn)]',
  danger: 'bg-[var(--d-danger-soft)] text-[var(--d-danger)]',
  solid: 'bg-white text-[var(--d-invert)]',
  // Aliases for the original ui/badge variant names.
  default: 'bg-white text-[var(--d-invert)]',
  secondary: 'bg-white/[0.07] text-[var(--d-muted)]',
  outline: 'border border-[var(--d-line)] text-[var(--d-subtle)]',
  destructive: 'bg-[var(--d-danger-soft)] text-[var(--d-danger)]',
  success: 'bg-[var(--d-ok-soft)] text-[var(--d-ok)]',
  warning: 'bg-[var(--d-warn-soft)] text-[var(--d-warn)]',
}

export function Badge({
  tone,
  variant,
  icon,
  className = '',
  children,
  ...rest
}) {
  const key = tone ?? variant ?? 'neutral'

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap ${TONES[key] ?? TONES.neutral} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </span>
  )
}
