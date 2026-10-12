import { cn } from "../../lib/utils";

function Checkbox({ className, type = "checkbox", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:accent-zinc-50 dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950",
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
