"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type LabelType = "checkbox" | "radio" | "switch" | "input";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  type?: LabelType;
}

function Label({
  className,
  type = "input",
  ...props
}: LabelProps) {

  const typeClass: Record<LabelType, string> = {
    checkbox: "",
    radio: "",
    switch: "",
    input: "dark:text-white text-[#828FA3]"
  }

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-xs leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
        typeClass[type],
      )}
      {...props}
    />
  )
}

export { Label }
