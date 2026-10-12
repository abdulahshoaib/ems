import { cn } from "../../lib/utils";

function ChevronRightIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3 w-3", className)}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Breadcrumb({ className, ...props }) {
  return <nav aria-label="breadcrumb" className={className} {...props} />;
}

function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-[13px] text-zinc-500 sm:gap-2 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({ className, ...props }) {
  return (
    <a
      className={cn(
        "transition-colors hover:text-zinc-900 dark:hover:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-zinc-900 dark:text-zinc-50", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ className, children, ...props }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:h-3 [&>svg]:w-3", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex h-7 w-7 items-center justify-center text-zinc-500 dark:text-zinc-400",
        className,
      )}
      {...props}
    >
      <span className="sr-only">More</span>
      <span aria-hidden="true">…</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
