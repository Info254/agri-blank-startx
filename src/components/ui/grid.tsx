import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number
  gap?: number
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 4, ...props }, ref) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-2", 
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }[cols] || "grid-cols-1"

    const gridGap = {
      1: "gap-1",
      2: "gap-2",
      3: "gap-3", 
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
    }[gap] || "gap-4"

    return (
      <div
        ref={ref}
        className={cn("grid", gridCols, gridGap, className)}
        {...props}
      />
    )
  }
)

Grid.displayName = "Grid"

export { Grid }