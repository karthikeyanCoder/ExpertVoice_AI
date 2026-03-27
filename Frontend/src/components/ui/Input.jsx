import React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(
  ({ className, type = 'text', disabled = false, placeholder, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-input px-4 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
