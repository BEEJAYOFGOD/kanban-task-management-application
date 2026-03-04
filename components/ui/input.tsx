import * as React from "react"
import { cn } from "@/lib/utils"
import { FieldError } from "react-hook-form";


interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

function Input({ className, type, error, ...props }: InputProps) {




  return (
    <div className={`relative  h-full`}>
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-primary  h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-[0.5px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
        error && "border-destructive"

      )}
      {...props}



    />
      {error && <p className="text-destructive text-xs absolute top-2.5 right-4">{error}</p>}
    </div>
  )
}

export { Input }
