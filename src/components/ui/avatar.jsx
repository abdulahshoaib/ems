import { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const AvatarContext = createContext({ loaded: false, setLoaded: () => {} });

function Avatar({ className, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <AvatarContext.Provider value={{ loaded, setLoaded }}>
      <span
        className={cn(
          "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

function AvatarImage({ className, onLoad, onError, alt = "", ...props }) {
  const { setLoaded } = useContext(AvatarContext);

  return (
    <img
      alt={alt}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setLoaded(false);
        onError?.(event);
      }}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }) {
  const { loaded } = useContext(AvatarContext);

  if (loaded) return null;

  return (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
