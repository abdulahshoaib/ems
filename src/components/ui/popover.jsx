import { createContext, useContext, useRef } from "react";
import {
  cn,
  useClickOutside,
  useControllableState,
  useEscapeKey,
} from "../../lib/utils";

const PopoverContext = createContext(null);

function usePopover(component) {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(`${component} must be used within <Popover>`);
  }
  return context;
}

function Popover({ open, defaultOpen = false, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef(null);

  useClickOutside(rootRef, () => setIsOpen(false), isOpen);
  useEscapeKey(() => setIsOpen(false), isOpen);

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
      <div ref={rootRef} className="relative inline-block text-left">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ className, onClick, ...props }) {
  const { open, setOpen } = usePopover("PopoverTrigger");

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

const alignStyles = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

const sideStyles = {
  bottom: "top-full mt-1.5",
  top: "bottom-full mb-1.5",
  left: "right-full top-0 mr-1.5",
  right: "left-full top-0 ml-1.5",
};

function PopoverContent({
  className,
  children,
  align = "center",
  side = "bottom",
  ...props
}) {
  const { open } = usePopover("PopoverContent");

  if (!open) return null;

  return (
    <div
      role="dialog"
      className={cn(
        "absolute z-50 w-60 rounded-md border border-zinc-200 bg-white p-3 text-left text-[13px] text-zinc-900 shadow-md outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        alignStyles[align] ?? alignStyles.center,
        sideStyles[side] ?? sideStyles.bottom,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Popover, PopoverTrigger, PopoverContent };
