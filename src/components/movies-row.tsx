"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useModalStore } from "@/stores/modal"
import type { Movie } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MoviesRowProps {
  title: string
  movies: Movie[]
}

const MoviesRow = ({ title, movies }: MoviesRowProps) => {
  const moviesRef = useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = useState(false)

  const scrollToPoint = (direction: "left" | "right") => {
    if (!moviesRef.current) return

    setIsScrollable(true)
    const { scrollLeft, clientWidth } = moviesRef.current
    const offset =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
    moviesRef.current.scrollTo({ left: offset, behavior: "smooth" })
  }

  const modalStore = useModalStore()

  return (
    <section aria-label="horizontally-scrollable row">
      {movies.length !== 0 && (
        <div className="container mx-auto w-full max-w-screen-2xl space-y-2.5">
          <h2 className="text-base font-semibold text-white/90 transition-colors hover:text-white md:text-xl ">
            {title ?? "-"}
          </h2>
          <div className="group relative">
            <Icons.chevronLeft
              aria-label="scroll to right"
              className={cn(
                "absolute left-2 top-1/3 z-10 aspect-square w-8 cursor-pointer text-white opacity-0 transition-all hover:scale-110 active:scale-90 group-hover:opacity-100",
                isScrollable ? "block" : "hidden"
              )}
              onClick={() => scrollToPoint("left")}
            />
            <div ref={moviesRef} className="flex space-x-2 overflow-x-auto">
              <ScrollArea className="h-full">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="relative aspect-square h-28 w-full min-w-[15rem] cursor-pointer overflow-hidden rounded-sm transition-transform hover:scale-105"
                    onClick={() => {
                      modalStore.setMovie(movie)
                      modalStore.toggleModal()
                      modalStore.setShouldPlay(false)
                    }}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${
                        movie.backdrop_path ?? movie.poster_path
                      }`}
                      alt={movie.title ?? "poster"}
                      fill
                      sizes="(max-width: 768px) 100vw, 
                    (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                ))}
              </ScrollArea>
            </div>
            <Icons.chevronRight
              aria-label="scroll to left"
              className="absolute right-2 top-1/3 z-10 aspect-square w-8 cursor-pointer text-white opacity-0 transition-all hover:scale-110 active:scale-90 group-hover:opacity-100"
              onClick={() => scrollToPoint("right")}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default MoviesRow
