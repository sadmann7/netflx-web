"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useModalStore } from "@/stores/modal"
import type { Show } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface HeroProps {
  shows: Show[]
}

const Hero = ({ shows }: HeroProps) => {
  const [randomShow, setRandomShow] = useState<Show | null>(null)

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * shows.length)
    setRandomShow(shows[randomNumber] ?? null)
  }, [shows])

  const modalStore = useModalStore()

  return (
    <section aria-label="hero section" className="w-full pb-24 pt-10 ">
      {randomShow && (
        <div className="container w-full max-w-screen-2xl">
          <div className="absolute inset-0 -z-10 h-screen w-full">
            <div
              className={cn(
                "absolute inset-0 z-10 h-full w-full bg-black/75 from-gray-900/10 to-[#010511]",
                "linear-gradient(to bottom,rgba(20,20,20,0) 0,rgba(20,20,20,.15) 15%,rgba(20,20,20,.35) 29%,rgba(20,20,20,.58) 44%,#141414 68%,#141414 100%)"
              )}
            />
            <Image
              src={`https://image.tmdb.org/t/p/original/${
                randomShow?.poster_path ?? randomShow?.backdrop_path
              }`}
              alt={randomShow?.title ?? "poster"}
              className="object-cover"
              fill
              priority
            />
          </div>
          <div className="grid max-w-lg space-y-2 pt-24 ">
            <h1 className="text-3xl font-bold md:text-4xl">
              {randomShow?.title ?? randomShow?.name}
            </h1>
            <div className="flex space-x-2 text-xs font-semibold md:text-sm">
              <p className="text-green-600">
                {randomShow?.vote_average * 10 ?? "-"}% Match
              </p>
              <p className="text-gray-300">{randomShow?.release_date ?? "-"}</p>
            </div>
            <p className="line-clamp-4 text-sm text-gray-300 md:text-base">
              {randomShow?.overview ?? "-"}
            </p>
            <div className="flex items-center space-x-2 pt-1.5">
              <Button
                aria-label="play video"
                className="flex items-center space-x-1.5 whitespace-nowrap rounded-sm bg-white px-3 py-1 text-sm font-bold text-black transition-opacity hover:opacity-75 active:opacity-100 md:text-base"
                onClick={() => {
                  modalStore.setShow(randomShow)
                  modalStore.toggleModal()
                  modalStore.setShouldPlay(true)
                }}
              >
                <Icons.play className="h-4 w-4" aria-hidden="true" />
                Play
              </Button>
              <Button
                aria-label="open movie details modal"
                className="flex items-center space-x-1.5 whitespace-nowrap rounded-sm bg-gray-400/40 px-3 py-1 text-sm font-medium text-white transition-opacity hover:opacity-75 active:opacity-100 md:text-base"
                onClick={() => {
                  modalStore.setShow(randomShow)
                  modalStore.toggleModal()
                  modalStore.setShouldPlay(false)
                }}
              >
                <Icons.info className="h-4 w-4" aria-hidden="true" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero
