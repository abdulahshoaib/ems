import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn, useControllableState, useLatest } from "../../lib/utils";

const SheetContext = createContext(null);

function useSheet(component) {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error(`${component} must be used within <Sheet>`);
  }
  return context;
}

function XIcon() {
  return (
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const sideStyles = {
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  top: "inset-x-0 top-0 h-auto w-full border-b",
  bottom: "inset-x-0 bottom-0 h-auto w-full border-t",
};

const hiddenStyles = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};

function Sheet({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();

  return (
    <SheetContext.Provider
      value={{
        open: isOpen,
        setOpen: setIsOpen,
        ids: {
          title: `${baseId}-title`,
          description: `${baseId}-description`,
        },
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({ className, onClick, ...props }) {
  const { open, setOpen } = useSheet("SheetTrigger");

  return (
    <button
      type="button"
      aria-haspopup="dialog"
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

function SheetClose({ className, onClick, ...props }) {
  const { setOpen } = useSheet("SheetClose");

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={className}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}) {
  const { open, setOpen, ids } = useSheet("SheetContent");
  const contentRef = useRef(null);
  const setOpenRef = useLatest(setOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const frame = requestAnimationFrame(() => setVisible(true));
    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpenRef.current(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, setOpenRef]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids.title}
        aria-describedby={ids.description}
        tabIndex={-1}
        className={cn(
          "fixed z-50 flex flex-col gap-3 border-zinc-200 bg-white p-4 text-left shadow-lg outline-none transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950",
          sideStyles[side] ?? sideStyles.right,
          visible ? "translate-x-0 translate-y-0" : hiddenStyles[side],
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <SheetClose className="absolute right-3 top-3 rounded-md p-1 text-zinc-500 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400">
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetClose>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1 text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  const { ids } = useSheet("SheetTitle");

  return (
    <h2
      id={ids.title}
      className={cn(
        "text-base font-semibold text-zinc-900 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  const { ids } = useSheet("SheetDescription");

  return (
    <p
      id={ids.description}
      className={cn("text-[13px] text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
