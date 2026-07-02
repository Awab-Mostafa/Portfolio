import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-xl border border-border/70 bg-background/90 px-4 text-base shadow-sm transition-all placeholder:text-muted-foreground focus-visible:border-primary/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background/70",
      className,
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
