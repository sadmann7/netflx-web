"use client"

import Image from "next/image"
import { useModalStore } from "@/stores/modal"
import type { Show } from "@/types"

import ShowModal from "@/components/show-modal"

interface SearchedShowsProps {
  shows: Show[]
}

const ShowsGrid = ({ shows }: SearchedShowsProps) => {
  // modal store
  const modalStore = useModalStore()

  return (
    <section
      aria-label="Grid of shows"
      className="container w-full max-w-screen-2xl pb-16 pt-10"
    >
      {modalStore.open ? (
        <ShowModal open={modalStore.open} setOpen={modalStore.setOpen} />
      ) : null}
      {/*  eslint-disable-next-line tailwindcss/classnames-order */}
      <div className="grid gap-y-3.5 xxs:grid-cols-2 xxs:gap-x-1.5 xxs:gap-y-5 xs:grid-cols-3 xs:gap-y-7 sm:grid-cols-3 sm:gap-y-10 md:grid-cols-4 md:gap-y-12 lg:gap-y-14 xl:grid-cols-5 xl:gap-y-16">
        {shows.map((show) => (
          <div
            key={show.id}
            className="relative aspect-video cursor-pointer overflow-hidden rounded-sm transition-transform hover:scale-105"
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
    </section>
  )
}

export default ShowsGrid
