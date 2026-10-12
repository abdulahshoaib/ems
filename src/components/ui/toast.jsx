import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { ToastContext } from "./toast-context";

const toastVariants = {
  default:
    "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  destructive:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
};

function Toast({ className, variant = "default", ...props }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-full items-start gap-2 rounded-lg border p-3 shadow-lg",
        toastVariants[variant] ?? toastVariants.default,
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }) {
  return (
    <div className={cn("text-[13px] font-semibold", className)} {...props} />
  );
}

function ToastDescription({ className, ...props }) {
  return <div className={cn("text-[12px] opacity-90", className)} {...props} />;
}

function ToastAction({ className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-transparent px-2.5 text-xs font-medium transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({ className, ...props }) {
  return (
    <button
      type="button"
      aria-label="Close"
      className={cn(
        "ml-auto rounded-md p-1 text-zinc-500 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400",
        className,
      )}
      {...props}
    >
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
    </button>
  );
}

function ToastItem({ item, onDismiss }) {
  useEffect(() => {
    if (item.duration === Infinity) return undefined;
    const timer = setTimeout(() => onDismiss(item.id), item.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss]);

  return (
    <Toast variant={item.variant}>
      <div className="grid gap-0.5">
        {item.title ? <ToastTitle>{item.title}</ToastTitle> : null}
        {item.description ? (
          <ToastDescription>{item.description}</ToastDescription>
        ) : null}
      </div>
      {item.action ? (
        <ToastAction onClick={item.action.onClick}>
          {item.action.label}
        </ToastAction>
      ) : null}
      <ToastClose onClick={() => onDismiss(item.id)} />
    </Toast>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4">
      {toasts.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastProvider({ children, duration = 5000 }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options = {}) => {
      counterRef.current += 1;
      const id = options.id ?? `toast-${counterRef.current}`;
      setToasts((prev) => [...prev, { duration, ...options, id }]);
      return id;
    },
    [duration],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
};
