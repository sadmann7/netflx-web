import * as React from "react"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input, type InputProps } from "@/components/ui/input"

interface DebouncedInputProps<TData extends object>
  extends Omit<InputProps, "onChange"> {
  containerClassName?: string
  value: string | number
  onChange: (value: string | number) => void
  setQuery: (query: string) => void
  setData: (data: TData[]) => void
  debounce?: number
}

export function DebouncedInput<TData extends object>({
  id = "query",
  containerClassName,
  value: initialValue,
  onChange,
  setData,
  setQuery,
  debounce = 500,
  className,
  ...props
}: DebouncedInputProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialValue)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // close search input on clicking outside,
  // and optimize with useCallback hook to prevent unnecessary re-renders
  const closeInput = React.useCallback(() => setIsOpen(false), [])
  useOnClickOutside(inputRef, closeInput)

  // handle debouncing
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce])

  // configure keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // close search input on pressing escape
      if (e.key === "Escape") {
        closeInput()
        setQuery("")
        setData([])
      }
      // open search input on pressing ctrl + k or cmd + k
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        if (!inputRef.current) return
        e.preventDefault()
        setIsOpen(true)
        inputRef.current.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [closeInput, setData, setQuery])

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder="Search..."
        className={cn(
          "h-auto rounded-none py-1.5 pl-8 text-sm transition-all dark:placeholder:text-slate-300 dark:focus:ring-offset-0",
          isOpen
            ? "w-24 border dark:border-slate-500 xxs:w-28 xs:w-44"
            : "w-0 border-none",
          className
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
      <Button
        aria-label="Search"
        variant="ghost"
        className={cn(
          "absolute top-1/2 h-auto -translate-y-1/2 rounded-full p-1 hover:bg-transparent dark:hover:bg-transparent",
          isOpen ? "left-1" : "left-[9px]"
        )}
        onClick={() => {
          if (!inputRef.current) return
          setIsOpen(!isOpen)
          inputRef.current.focus()
        }}
      >
        <Icons.search
          className={cn(
            "text-slate-50 transition-opacity hover:opacity-75 active:scale-95",
            isOpen ? "h-4 w-4" : "h-5 w-5"
          )}
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}
