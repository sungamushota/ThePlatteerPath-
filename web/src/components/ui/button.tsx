import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "dark"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-gold-500 text-white hover:bg-gold-600 rounded-full shadow-md shadow-gold-500/15 hover:shadow-lg hover:shadow-gold-500/20 active:scale-[0.98]":
              variant === "default",
            "bg-stone-100 text-stone-800 hover:bg-stone-200 rounded-full":
              variant === "secondary",
            "border-2 border-gold-200 text-gold-700 hover:bg-gold-50 rounded-full":
              variant === "outline",
            "hover:bg-stone-100 text-stone-600 rounded-lg":
              variant === "ghost",
            "bg-stone-900 text-cream hover:bg-stone-800 rounded-full shadow-md hover:shadow-lg active:scale-[0.98]":
              variant === "dark",
          },
          {
            "h-10 px-5 py-2 text-sm": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-12 px-8 text-base tracking-wide": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
