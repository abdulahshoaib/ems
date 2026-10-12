import { createContext, useContext, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn, useControllableState, useLatest } from "../../lib/utils";

const AlertDialogContext = createContext(null);

function useAlertDialog(component) {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(`${component} must be used within <AlertDialog>`);
  }
  return context;
}

function AlertDialog({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();

  return (
    <AlertDialogContext.Provider
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
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({ className, onClick, ...props }) {
  const { open, setOpen } = useAlertDialog("AlertDialogTrigger");

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

function AlertDialogContent({ className, children, ...props }) {
  const { open, setOpen, ids } = useAlertDialog("AlertDialogContent");
  const contentRef = useRef(null);
  const setOpenRef = useLatest(setOpen);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();

    function handleKeyDown(event) {
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
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={contentRef}
        role="alertdialog"
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
      </div>
    </div>,
    document.body,
  );
}

function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1 text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }) {
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

function AlertDialogTitle({ className, ...props }) {
  const { ids } = useAlertDialog("AlertDialogTitle");

  return (
    <h2
      id={ids.title}
      className={cn(
        "text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }) {
  const { ids } = useAlertDialog("AlertDialogDescription");

  return (
    <p
      id={ids.description}
      className={cn("text-[13px] text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, onClick, ...props }) {
  const { setOpen } = useAlertDialog("AlertDialogAction");

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md bg-zinc-900 px-3 text-[13px] font-medium text-zinc-50 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, onClick, ...props }) {
  const { setOpen } = useAlertDialog("AlertDialogCancel");

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={cn(
        "mt-2 inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-transparent px-3 text-[13px] font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 sm:mt-0 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
