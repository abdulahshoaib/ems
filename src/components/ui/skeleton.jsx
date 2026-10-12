export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-white/[0.07] ${className}`} />
}

export function EventRowSkeleton() {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-56 max-w-full" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-16" />
      </div>
    </li>
  )
}

export function ActivityRowSkeleton() {
  return (
    <li className="flex gap-3 py-2.5">
      <Skeleton className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-44 max-w-full" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>
    </li>
  )
}

export function MetricsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {[0, 1, 2, 3].map((index) => (
        <Skeleton key={index} className="h-4 w-24" />
      ))}
    </div>
  )
}
