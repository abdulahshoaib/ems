import { createContext, useContext, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn, useControllableState, useLatest } from "../../lib/utils";

const DialogContext = createContext(null);

function useDialog(component) {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(`${component} must be used within <Dialog>`);
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

function Dialog({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();

  return (
    <DialogContext.Provider
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
    </DialogContext.Provider>
  );
}

function DialogTrigger({ className, onClick, ...props }) {
  const { open, setOpen } = useDialog("DialogTrigger");

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

function DialogClose({ className, onClick, ...props }) {
  const { setOpen } = useDialog("DialogClose");

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

function DialogContent({ className, children, showClose = true, ...props }) {
  const { open, setOpen, ids } = useDialog("DialogContent");
  const contentRef = useRef(null);
  const setOpenRef = useLatest(setOpen);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpenRef.current(false);
        return;
      }

      if (event.key === "Tab") {
        const node = contentRef.current;
        if (!node) return;

        const focusable = node.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, setOpenRef]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          "relative z-50 grid w-full max-w-lg gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-lg outline-none dark:border-zinc-800 dark:bg-zinc-950",
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogClose className="absolute right-3 top-3 rounded-md p-1 text-zinc-500 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1 text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  const { ids } = useDialog("DialogTitle");

  return (
    <h2
      id={ids.title}
      className={cn(
        "text-base font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  const { ids } = useDialog("DialogDescription");

  return (
    <p
      id={ids.description}
      className={cn("text-[13px] text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
