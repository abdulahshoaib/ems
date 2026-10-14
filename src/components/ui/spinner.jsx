import { cn } from "../../lib/utils";

const sizes = {
  sm: "h-3 w-3",
  default: "h-4 w-4",
  lg: "h-6 w-6",
};

function Spinner({ className, size = "default", label = "Loading", ...props }) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "animate-spin text-zinc-900 dark:text-zinc-900",
        sizes[size] ?? sizes.default,
        className,
      )}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { Spinner };
