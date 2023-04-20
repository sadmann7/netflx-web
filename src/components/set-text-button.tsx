"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { buttonVariants, type ButtonProps } from "@/components/ui/button"

interface SetTextButtonProps extends ButtonProps {
  initialText: string
  finalText: string
}

const SetTextButton = React.forwardRef<HTMLButtonElement, SetTextButtonProps>(
  ({ className, variant, size, initialText, finalText, ...props }, ref) => {
    const [text, setText] = React.useState(initialText)

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={() => setText(finalText)}
        disabled={text === finalText}
      >
        {text}
      </button>
    )
  }
)
SetTextButton.displayName = "SetTextButton"

export default SetTextButton
