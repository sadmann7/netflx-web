"use client"

import * as React from "react"
import Image from "next/image"
import { useModalStore } from "@/stores/modal"
import { useMyListStore } from "@/stores/my-list"
import type { Show } from "@/types"
import { toast } from "react-hot-toast"

import { cn } from "@/lib/utils"
import DynamicTooltip from "@/components/dynamic-tooltip"
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
  const [isHoverd, setIsHoverd] = React.useState(false)

  // stores
  const modalStore = useModalStore()
  const myListStore = useMyListStore()

  return (
    <div
      className="relative aspect-video min-w-[15rem] cursor-pointer overflow-hidden rounded transition-all hover:z-20 hover:scale-125"
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
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
        className={cn("h-auto w-full object-cover", isHoverd && "hidden")}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full bg-neutral-800 p-4",
          isHoverd ? "block" : "hidden"
        )}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Play show"
              className="h-auto rounded-full p-1.5 hover:bg-white/80 focus:ring-offset-0 hover:dark:bg-white/80"
              onClick={() => {
                modalStore.setShow(show)
                modalStore.setOpen(true)
                modalStore.setPlay(true)
              }}
            >
              <Icons.play
                className="h-3 w-3 fill-current text-slate-950 dark:text-slate-950"
                aria-hidden="true"
              />
            </Button>
            {myListStore.shows.some((s) => s.id === show.id) ? (
              <DynamicTooltip text="Remove from My List">
                <Button
                  aria-label="Remove show from my list"
                  variant="ghost"
                  className="h-auto rounded-full bg-neutral-400 p-1 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                  onClick={() => {
                    show ? myListStore.removeShow(show) : null
                    toast.success("Removed from My List")
                  }}
                >
                  <Icons.check className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DynamicTooltip>
            ) : (
              <DynamicTooltip text="Add to My List">
                <Button
                  aria-label="Add show to my list"
                  variant="ghost"
                  className="h-auto rounded-full bg-neutral-400 p-1 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                  onClick={() => {
                    show ? myListStore.addShow(show) : null
                    toast.success("Added to My List")
                  }}
                >
                  <Icons.add className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DynamicTooltip>
            )}
          </div>
          <DynamicTooltip text="More Info">
            <Button
              aria-label="Show more info"
              variant="ghost"
              className="h-auto rounded-full bg-neutral-400 p-1 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              onClick={() => {
                modalStore.setShow(show)
                modalStore.setOpen(true)
                modalStore.setPlay(false)
              }}
            >
              <Icons.chevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DynamicTooltip>
        </div>
      </div>
    </div>
  )
}
