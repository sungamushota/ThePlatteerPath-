import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  maxLength?: number
  showCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, id, maxLength, showCount, value, ...props },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const charCount = typeof value === "string" ? value.length : 0

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-stone-500"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[120px] w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 transition-all duration-200 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/10 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-red-400 focus:border-red-400 focus:ring-red-400/10",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex justify-between">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {showCount && maxLength && (
            <p
              className={cn(
                "ml-auto text-xs text-stone-400",
                charCount > maxLength * 0.9 && "text-gold-600",
                charCount >= maxLength && "text-red-500"
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
