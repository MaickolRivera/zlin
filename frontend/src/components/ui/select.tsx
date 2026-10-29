import * as React from "react"
import { cn } from "cn"

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1 text-sm text-muted-foreground dark:bg-input/30 [&>option]:bg-background",
        className
      )}
      {...props}
    />
  )
}

export { Select }
