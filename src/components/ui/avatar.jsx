import { getInitials } from '../../lib/format'

const SIZES = {
  sm: 'h-7 w-7 text-[10.5px]',
  md: 'h-6.5 w-6.5 text-[10.5px]',
  lg: 'h-11 w-11 text-[15px]',
  xl: 'h-14 w-14 text-lg',
}

export function Avatar({ name = '', src, size = 'md', className = '' }) {
  const sizeClasses = SIZES[size] ?? SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={`${name} profile photo`}
        className={`shrink-0 rounded-full object-cover ${sizeClasses} ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white/[0.09] font-semibold text-[var(--d-text)] ring-1 ring-white/10 ${sizeClasses} ${className}`}
    >
      {getInitials(name)}
    </span>
  )
}
