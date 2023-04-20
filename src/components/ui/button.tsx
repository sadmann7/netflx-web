import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
        outline:
          "border border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100",
        subtle:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100",
        ghost:
          "bg-transparent hover:bg-slate-100 data-[state=open]:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:data-[state=open]:bg-transparent",
        link: "bg-transparent text-slate-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-slate-100 dark:hover:bg-transparent",
        brand:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
        flat: "rounded-none bg-slate-900 text-slate-50 hover:bg-red-600 hover:text-white dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-red-600 dark:hover:text-slate-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        auto: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
