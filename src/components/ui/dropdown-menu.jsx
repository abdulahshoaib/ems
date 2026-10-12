import { createContext, useContext, useRef } from "react";
import {
  cn,
  useClickOutside,
  useControllableState,
  useEscapeKey,
} from "../../lib/utils";

const DropdownMenuContext = createContext(null);

function useDropdownMenu(component) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(`${component} must be used within <DropdownMenu>`);
  }
  return context;
}

function DropdownMenu({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef(null);

  useClickOutside(rootRef, () => setIsOpen(false), isOpen);
  useEscapeKey(() => setIsOpen(false), isOpen);

  return (
    <DropdownMenuContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      <div ref={rootRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({ className, onClick, ...props }) {
  const { open, setOpen } = useDropdownMenu("DropdownMenuTrigger");

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      className={className}
      {...props}
    />
  );
}

const alignStyles = {
  start: "left-0",
  end: "right-0",
};

function DropdownMenuContent({
  className,
  children,
  align = "start",
  sideOffset = 4,
  ...props
}) {
  const { open } = useDropdownMenu("DropdownMenuContent");

  if (!open) return null;

  return (
    <div
      role="menu"
      style={{ marginTop: sideOffset }}
      className={cn(
        "absolute top-full z-50 min-w-[9rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-left text-zinc-900 shadow-md outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        alignStyles[align] ?? alignStyles.start,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({
  className,
  inset = false,
  onClick,
  disabled = false,
  ...props
}) {
  const { setOpen } = useDropdownMenu("DropdownMenuItem");

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={cn(
        "flex w-full cursor-pointer select-none items-center gap-1.5 rounded-sm px-2 py-1 text-[13px] outline-none transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800",
        inset && "pl-7",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  checked = false,
  onCheckedChange,
  onClick,
  children,
  ...props
}) {
  const { setOpen } = useDropdownMenu("DropdownMenuCheckboxItem");

  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={(event) => {
        onClick?.(event);
        onCheckedChange?.(!checked);
        setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-1.5 rounded-sm py-1 pl-7 pr-2 text-[13px] outline-none transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : null}
      </span>
      {children}
    </button>
  );
}

function DropdownMenuLabel({ className, inset = false, ...props }) {
  return (
    <div
      className={cn(
        "px-2 py-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400",
        inset && "pl-7",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-800", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }) {
  return (
    <span
      className={cn(
        "ml-auto text-[11px] tracking-widest text-zinc-500 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
