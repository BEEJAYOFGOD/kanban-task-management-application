import * as React from "react"

import { cn } from "@/lib/utils"

interface TextAreaProps extends React.ComponentProps<"textarea"> {
  error?: string;
}

function Textarea({ className, error, ...props }: TextAreaProps) {
  return (
    <div className="relative">
    <textarea
        cols={20}

      data-slot="textarea"
      className={cn(
        " placeholder:text-muted-foreground  focus-visible:border-primary focus-visible:ring-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0.5px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
        error && "border-destructive"
      )}
      {...props}
    />

      {error && <p className="text-destructive text-xs absolute bottom-2 right-4">{error}</p>}

    </div>
  )
}

export { Textarea }
