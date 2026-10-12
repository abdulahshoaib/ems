import { cn } from "../../lib/utils";

function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-[13px] font-medium leading-none text-zinc-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
