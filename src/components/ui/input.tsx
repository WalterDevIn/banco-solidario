import * as React from "react"

import { cn } from "@/lib/utils"
import "./input.css"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return <input type={type} ref={ref} className={cn("input", className)} {...props} />
  }
)
Input.displayName = "Input"

export { Input }
