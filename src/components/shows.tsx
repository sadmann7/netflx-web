"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useModalStore } from "@/stores/modal"
import type { Show } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ShowsProps {
  title: string
  shows: Show[]
}

const Shows = ({ title, shows }: ShowsProps) => {
  const showsRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  // handle scroll to left or right
  const scrollToDirection = (direction: "left" | "right") => {
    if (!showsRef.current) return

    setIsScrollable(true)
    const { scrollLeft, clientWidth } = showsRef.current
    const offset =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
    showsRef.current.scrollTo({ left: offset, behavior: "smooth" })
  }

  // modal store for storing show and modal state
  const modalStore = useModalStore()

  return (
    <section aria-label="Show's carousel section">
      {shows.length !== 0 && (
        <div className="container w-full max-w-screen-2xl space-y-2.5">
          <h2 className="text-base font-semibold text-white/90 transition-colors hover:text-white md:text-xl ">
            {title ?? "-"}
          </h2>
          <div className="group relative">
            <Button
              aria-label="Scroll to right"
              variant="ghost"
              className={cn(
                "absolute left-2 top-1/3 z-10 h-auto rounded-full p-0 opacity-0 hover:bg-transparent group-hover:opacity-100 dark:hover:bg-transparent",
                isScrollable ? "block" : "hidden"
              )}
              onClick={() => scrollToDirection("left")}
            >
              <Icons.chevronLeft
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </Button>
            <div
              ref={showsRef}
              className="no-scrollbar h-full w-full overflow-x-auto overflow-y-hidden"
            >
              <div className="flex items-center gap-1">
                {shows.map((show) => (
                  <div
                    key={show.id}
                    className="relative aspect-video min-w-[15rem] cursor-pointer overflow-hidden rounded-sm transition-transform hover:scale-105"
                    onClick={() => {
                      modalStore.setShow(show)
                      modalStore.setOpen(true)
                      modalStore.setPlay(false)
                    }}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${
                        show.backdrop_path ?? show.poster_path
                      }`}
                      alt={show.title ?? "poster"}
                      fill
                      sizes="(max-width: 768px) 100vw, 
                        (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button
              aria-label="Scroll to left"
              variant="ghost"
              className="absolute right-2 top-1/3 z-10 h-auto rounded-full p-0 opacity-0 hover:bg-transparent group-hover:opacity-100 dark:hover:bg-transparent"
              onClick={() => scrollToDirection("right")}
            >
              <Icons.chevronRight
                className="h-8 w-8 text-white"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Shows
