import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  cn,
  useClickOutside,
  useControllableState,
  useEscapeKey,
} from "../../lib/utils";

const SelectContext = createContext(null);

function useSelect(component) {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(`${component} must be used within <Select>`);
  }
  return context;
}

function ChevronDownIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Select({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
  ...props
}) {
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState(() => new Map());
  const rootRef = useRef(null);

  useClickOutside(rootRef, () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  const registerItem = useCallback((itemValue, label) => {
    setLabels((prev) => {
      if (prev.get(itemValue) === label) return prev;
      const next = new Map(prev);
      next.set(itemValue, label);
      return next;
    });
  }, []);

  const handleSelect = (next) => {
    setCurrent(next);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: current,
        setValue: handleSelect,
        open,
        setOpen,
        disabled,
        labels,
        registerItem,
      }}
    >
      <div ref={rootRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen, disabled } = useSelect("SelectTrigger");

  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      disabled={disabled}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-8 w-full items-center justify-between gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[13px] text-zinc-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "h-3.5 w-3.5 shrink-0 opacity-50 transition-transform",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

function SelectValue({ className, placeholder, ...props }) {
  const { value, labels } = useSelect("SelectValue");
  const hasValue = value !== undefined && value !== null && value !== "";
  const label = hasValue ? (labels.get(value) ?? value) : undefined;

  return (
    <span
      className={cn(
        "truncate",
        !hasValue && "text-zinc-400 dark:text-zinc-500",
        className,
      )}
      {...props}
    >
      {hasValue ? label : placeholder}
    </span>
  );
}

function SelectContent({ className, children, ...props }) {
  const { open } = useSelect("SelectContent");

  if (!open) return null;

  return (
    <div
      role="listbox"
      className={cn(
        "absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-zinc-200 bg-white p-1 text-[13px] text-zinc-900 shadow-md outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({ className, value, children, disabled = false, ...props }) {
  const { value: selected, setValue, registerItem } = useSelect("SelectItem");
  const isSelected = selected === value;
  const label = typeof children === "string" ? children : String(value);

  useEffect(() => {
    registerItem(value, label);
  }, [registerItem, value, label]);

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1 pl-7 pr-2 text-left text-[13px] outline-none transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800",
        className,
      )}
      {...props}
    >
      {isSelected ? <CheckIcon className="absolute left-2 h-3.5 w-3.5" /> : null}
      {children}
    </button>
  );
}

function SelectGroup({ className, ...props }) {
  return <div role="group" className={cn("p-1", className)} {...props} />;
}

function SelectLabel({ className, ...props }) {
  return (
    <div
      className={cn(
        "px-2 py-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
};
