import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, onFocus, onClick, onChange, ...props }: React.ComponentProps<"input">) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === "number") {
      if (e.currentTarget.value === "0" || e.currentTarget.value === "0.00") {
        e.currentTarget.select()
      }
    }
    onFocus?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (type === "number") {
      if (e.currentTarget.value === "0" || e.currentTarget.value === "0.00") {
        e.currentTarget.select()
      }
    }
    onClick?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const val = e.target.value
      // Strip leading zeros before any non-zero digit (e.g. '01' -> '1', '025' -> '25', '-05' -> '-5')
      if (/^(-?)0+([1-9].*)$/.test(val)) {
        e.target.value = val.replace(/^(-?)0+([1-9])/, "$1$2")
      }
    }
    onChange?.(e)
  }

  return (
    <input
      type={type}
      data-slot="input"
      onFocus={handleFocus}
      onClick={handleClick}
      onChange={handleChange}
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
