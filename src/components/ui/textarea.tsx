import * as React from 'react'
import { cn } from '@/utils/cn'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-md border border-border bg-surface-alt px-3 py-2 text-sm text-foreground placeholder:text-muted resize-none',
          'transition-colors duration-200',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
