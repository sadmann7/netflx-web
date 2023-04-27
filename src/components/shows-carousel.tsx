"use client"

import * as React from "react"
import Image from "next/image"
import { useModalStore } from "@/stores/modal"
import type { Show } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ShowsCarouselProps {
  title: string
  shows: Show[]
}

const ShowsCarousel = ({ title, shows }: ShowsCarouselProps) => {
  const showsRef = React.useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = React.useState(false)

  // handle scroll to left and right
  const scrollToDirection = (direction: "left" | "right") => {
    if (!showsRef.current) return

    setIsScrollable(true)
    const { scrollLeft, clientWidth } = showsRef.current
    const offset =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
    showsRef.current.scrollTo({ left: offset, behavior: "smooth" })

    if (scrollLeft === 0 && direction === "left") {
      showsRef.current.scrollTo({
        left: showsRef.current.scrollWidth,
        behavior: "smooth",
      })
    }
  }

  return (
    <section aria-label="Carousel of shows">
      {shows.length !== 0 && (
        <div className="container w-full max-w-screen-2xl space-y-1 sm:space-y-2.5">
          <h2 className="text-lg font-semibold text-white/90 transition-colors hover:text-white sm:text-xl">
            {title ?? "-"}
          </h2>
          <div className="group relative">
            {shows.length > 5 ? (
              <>
                <Button
                  aria-label="Scroll to right"
                  variant="ghost"
                  className={cn(
                    "absolute left-0 top-0 z-10 h-[8.5rem] rounded-none rounded-r bg-slate-950/50 px-2 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50",
                    isScrollable ? "block" : "hidden"
                  )}
                  onClick={() => scrollToDirection("left")}
                >
                  <Icons.chevronLeft
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  aria-label="Scroll to left"
                  variant="ghost"
                  className="absolute right-0 top-0 z-10 h-[8.5rem] rounded-none rounded-l bg-slate-950/50 px-2 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50"
                  onClick={() => scrollToDirection("right")}
                >
                  <Icons.chevronRight
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </Button>
              </>
            ) : null}
            <div
              ref={showsRef}
              className="no-scrollbar flex h-full w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden"
            >
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ShowsCarousel

const ShowCard = ({ show }: { show: Show }) => {
  return (
    <Image
      src={`https://image.tmdb.org/t/p/w500/${
        show.backdrop_path ?? show.poster_path ?? ""
      }`}
      alt={show.title ?? show.name ?? "poster"}
      width={240}
      height={135}
      loading="lazy"
      className="aspect-video cursor-pointer object-cover transition-all hover:z-20 hover:scale-110"
      onClick={() => {
        useModalStore.setState({
          show: show,
          open: true,
          play: false,
        })
      }}
    />
  )
}
