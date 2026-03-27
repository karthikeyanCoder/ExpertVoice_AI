import React from 'react'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background'

    const variants = {
      default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
      outline: 'border border-input bg-background hover:bg-muted text-foreground',
      ghost: 'hover:bg-muted text-foreground',
      destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      icon: 'h-10 w-10',
      'icon-sm': 'h-8 w-8',
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
