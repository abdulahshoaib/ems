import { createContext, useContext } from "react";
import { cn, useControllableState } from "../../lib/utils";

const TabsContext = createContext(null);

function useTabs(component) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} must be used within <Tabs>`);
  }
  return context;
}

function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
  ...props
}) {
  const [active, setActive] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsContext.Provider value={{ value: active, setValue: setActive }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-8 items-center justify-center gap-0.5 rounded-lg bg-zinc-100 p-0.5 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, value, disabled = false, ...props }) {
  const { value: active, setValue } = useTabs("TabsTrigger");
  const selected = active === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      data-state={selected ? "active" : "inactive"}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-600",
        selected
          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
          : "hover:text-zinc-900 dark:hover:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, value, ...props }) {
  const { value: active } = useTabs("TabsContent");

  if (active !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn("mt-2 focus-visible:outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
