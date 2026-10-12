import { cn } from "../../lib/utils";

const sideStyles = {
  top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
  left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
  right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
};

function Tooltip({ className, children, ...props }) {
  return (
    <span className={cn("group relative inline-flex", className)} {...props}>
      {children}
    </span>
  );
}

function TooltipTrigger({ className, ...props }) {
  return (
    <span
      tabIndex={0}
      className={cn(
        "inline-flex cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600",
        className,
      )}
      {...props}
    />
  );
}

function TooltipContent({ className, side = "top", children, ...props }) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 w-max max-w-xs rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium leading-4 text-zinc-50 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-zinc-50 dark:text-zinc-900",
        sideStyles[side] ?? sideStyles.top,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
