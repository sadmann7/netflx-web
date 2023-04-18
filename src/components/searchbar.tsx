"use client"

import * as React from "react"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { useSearchStore } from "@/stores/search"

import { searchShows } from "@/lib/fetcher"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Searchbar = () => {
  // search store
  const searchStore = useSearchStore()

  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // search shows by query
  async function searchShowsByQuery(e: React.ChangeEvent<HTMLInputElement>) {
    searchStore.setQuery(e.target.value)
    const shows = await searchShows(searchStore.query)
    void searchStore.setShows(shows.results)
  }

  // close search input on clicking outside
  const closeInput = React.useCallback(() => setIsOpen(false), [])
  useOnClickOutside(inputRef, closeInput)

  return (
    <fieldset className="relative">
      <label htmlFor="showsQuery" className="sr-only">
        Search shows
      </label>
      <Input
        ref={inputRef}
        id="showsQuery"
        type="text"
        placeholder="Search shows..."
        className={cn(
          "h-auto bg-transparent py-2 text-sm transition-all placeholder:text-slate-400",
          isOpen ? "w-44 pl-10" : "w-0 pl-8"
        )}
        value={searchStore.query}
        onChange={(e) => void searchShowsByQuery(e)}
      />
      <Button
        aria-label="Search button for searching shows"
        variant="ghost"
        className="absolute left-2 top-1/2 h-auto -translate-y-1/2 rounded-full p-1 hover:bg-transparent dark:hover:bg-transparent"
        onClick={() => {
          if (!inputRef.current) return
          setIsOpen(!isOpen)
          inputRef.current.focus()
        }}
      >
        <Icons.search
          className="h-5 w-5 text-slate-50 transition-opacity hover:opacity-75 active:opacity-100"
          aria-hidden="true"
        />
      </Button>
    </fieldset>
  )
}

export default Searchbar
