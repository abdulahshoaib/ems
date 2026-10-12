import { cn, useControllableState } from "../../lib/utils";

function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  ...props
}) {
  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      data-state={isChecked ? "checked" : "unchecked"}
      onClick={() => setIsChecked((prev) => !prev)}
      className={cn(
        "peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950",
        isChecked ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-800",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-3 w-3 rounded-full bg-white shadow-sm ring-0 transition-transform dark:bg-zinc-950",
          isChecked ? "translate-x-3" : "translate-x-0",
        )}
      />
    </button>
  );
}

export { Switch };
