import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-background font-semibold hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]',
        outline:
          'border border-border bg-transparent text-foreground hover:border-accent hover:text-accent hover:bg-accent-dim',
        ghost:
          'text-muted hover:text-foreground hover:bg-surface-alt',
        link:
          'text-accent underline-offset-4 hover:underline p-0 h-auto',
        destructive:
          'bg-red-600 text-white hover:bg-red-500',
        secondary:
          'bg-surface border border-border text-foreground hover:border-accent-purple hover:text-accent-purple',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
