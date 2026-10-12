import { cn } from "../../lib/utils";

const variants = {
  default:
    "border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900",
  secondary:
    "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
  outline: "border-zinc-200 text-zinc-900 dark:border-zinc-800 dark:text-zinc-50",
  destructive:
    "border-transparent bg-red-600 text-white dark:bg-red-600 dark:text-white",
  success:
    "border-transparent bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white",
  warning:
    "border-transparent bg-amber-500 text-white dark:bg-amber-500 dark:text-white",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-600",
        variants[variant] ?? variants.default,
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
