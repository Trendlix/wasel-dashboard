import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const isSearchInput = type === "search"

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 common-rounded border border-main-whiteMarble bg-main-white px-3 py-2 text-sm text-main-hydrocarbon shadow-sm transition-[border-color,box-shadow,background-color] duration-[var(--wasel-motion-duration)] ease-[var(--wasel-motion-ease-out)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-main-hydrocarbon placeholder:text-main-trueBlack/50 focus-visible:border-main-primary focus-visible:ring-2 focus-visible:ring-main-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-main-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-main-titaniumWhite disabled:text-main-sharkGray/70 disabled:opacity-90 aria-invalid:border-main-remove aria-invalid:ring-2 aria-invalid:ring-main-remove/25",
        isSearchInput &&
          "h-full border-0 bg-transparent px-0 py-0 shadow-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-0 aria-invalid:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
