import { cn } from "../../lib/utils";

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

function Container({
  as: Component = "div",
  className,
  size = "lg",
  ...props
}) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-5 lg:px-6",
        sizes[size] ?? sizes.lg,
        className,
      )}
      {...props}
    />
  );
}

export { Container };
