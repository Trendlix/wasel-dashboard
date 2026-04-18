import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full common-rounded border border-main-whiteMarble bg-main-white px-3 py-2.5 text-sm text-main-hydrocarbon shadow-sm transition-[border-color,box-shadow,background-color] outline-none placeholder:text-main-trueBlack/50 focus-visible:border-main-primary focus-visible:ring-2 focus-visible:ring-main-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-main-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-main-titaniumWhite disabled:text-main-sharkGray/70 disabled:opacity-90 aria-invalid:border-main-remove aria-invalid:ring-2 aria-invalid:ring-main-remove/25",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
