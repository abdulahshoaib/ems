import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-white text-[var(--d-invert)] hover:bg-[#d4d4d8]',
  secondary:
    'border border-[var(--d-line-strong)] text-[var(--d-text)] hover:bg-white/[0.06]',
  ghost: 'text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]',
  danger:
    'border border-[var(--d-danger-line)] text-[var(--d-danger)] hover:bg-[var(--d-danger-soft)]',
  // Aliases for the original ui/button variant names.
  default: 'bg-white text-[var(--d-invert)] hover:bg-[#d4d4d8]',
  outline:
    'border border-[var(--d-line-strong)] text-[var(--d-text)] hover:bg-white/[0.06]',
  destructive:
    'border border-[var(--d-danger-line)] text-[var(--d-danger)] hover:bg-[var(--d-danger-soft)]',
  link: 'text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]',
}

const SIZES = {
  sm: 'h-7 gap-1.5 rounded-md px-2.5 text-[12.5px]',
  md: 'h-8.5 gap-1.5 rounded-md px-3 text-[13px]',
  lg: 'h-9.5 gap-2 rounded-lg px-4 text-[13.5px]',
  // Aliases for the original ui/button size names.
  default: 'h-8.5 gap-1.5 rounded-md px-3 text-[13px]',
  icon: 'h-8 w-8 rounded-md',
}

export function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon,
  iconAfter,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'd-focus inline-flex shrink-0 items-center justify-center font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-40',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon}
      {children}
      {iconAfter}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
