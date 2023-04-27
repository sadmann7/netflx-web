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
      className="container w-full max-w-screen-2xl"
    >
      {modalStore.open ? (
        <ShowModal open={modalStore.open} setOpen={modalStore.setOpen} />
      ) : null}
      {/*  eslint-disable-next-line tailwindcss/classnames-order */}
      <div className="grid w-fit gap-y-3.5 xxs:grid-cols-2 xxs:gap-x-1.5 xxs:gap-y-5 xs:grid-cols-3 xs:gap-y-7 sm:grid-cols-3 sm:gap-y-10 md:grid-cols-4 md:gap-y-12 lg:gap-y-14 xl:grid-cols-5 xl:gap-y-16">
        {shows.map((show) => (
          <Image
            key={show.id}
            src={`https://image.tmdb.org/t/p/w500/${
              show.backdrop_path ?? show.poster_path ?? ""
            }`}
            alt={show.title ?? show.name ?? "poster"}
            width={240}
            height={135}
            priority
            className="aspect-video cursor-pointer object-cover transition-all hover:z-20 hover:scale-110"
            onClick={() => {
              modalStore.setShow(show)
              modalStore.setOpen(true)
              modalStore.setPlay(false)
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default ShowsGrid
