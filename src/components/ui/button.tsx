import * as React from "react";
import { cn } from "@/lib/utils";
import "./button.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "lg" | "icon" | "default";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "btn",
      `btn-${variant}`,
      size !== "default" && `btn-${size}`,
      className
    );
    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
