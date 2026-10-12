/**
 * Accessible filter control rendered as a group of toggle buttons.
 */
export function FilterTabs({ options, value, onChange, label = 'Filter' }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`d-focus inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-medium transition-colors ${
              isActive
                ? 'border-transparent bg-white text-[var(--d-invert)]'
                : 'border-[var(--d-line)] text-[var(--d-muted)] hover:bg-white/[0.06] hover:text-[var(--d-text)]'
            }`}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span
                className={`rounded px-1 text-[10.5px] leading-4 ${
                  isActive
                    ? 'bg-black/15 text-[var(--d-invert)]'
                    : 'bg-white/[0.07] text-[var(--d-subtle)]'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
