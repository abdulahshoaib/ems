import { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

function useAccordion(component) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be used within <Accordion>`);
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

function Accordion({
  type = "single",
  collapsible = false,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}) {
  const isMultiple = type === "multiple";
  const [internal, setInternal] = useState(() => {
    if (defaultValue !== undefined) return defaultValue;
    return isMultiple ? [] : "";
  });
  const current = value !== undefined ? value : internal;

  const toggle = (itemValue) => {
    let next;

    if (isMultiple) {
      const opened = Array.isArray(current) ? current : [];
      next = opened.includes(itemValue)
        ? opened.filter((entry) => entry !== itemValue)
        : [...opened, itemValue];
    } else {
      next = current === itemValue ? (collapsible ? "" : current) : itemValue;
    }

    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const openValues = isMultiple
    ? Array.isArray(current)
      ? current
      : []
    : current
      ? [current]
      : [];

  return (
    <AccordionContext.Provider value={{ openValues, toggle }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ className, value, ...props }) {
  const { openValues } = useAccordion("AccordionItem");
  const isOpen = openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn("border-b border-zinc-200 dark:border-zinc-800", className)}
        {...props}
      />
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ className, children, ...props }) {
  const { toggle } = useAccordion("AccordionTrigger");
  const item = useContext(AccordionItemContext);
  const isOpen = item?.isOpen ?? false;

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => item && toggle(item.value)}
      className={cn(
        "flex w-full flex-1 items-center justify-between py-2.5 text-left text-[13px] font-medium text-zinc-900 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-50 dark:focus-visible:ring-zinc-600 [&[aria-expanded=true]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-200 dark:text-zinc-400" />
    </button>
  );
}

function AccordionContent({ className, children, ...props }) {
  const item = useContext(AccordionItemContext);

  if (!item?.isOpen) return null;

  return (
    <div
      role="region"
      className={cn(
        "overflow-hidden pb-3 text-[13px] text-zinc-600 dark:text-zinc-400",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
