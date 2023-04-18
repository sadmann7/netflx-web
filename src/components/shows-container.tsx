"use client"

import { useModalStore } from "@/stores/modal"
import { useSearchStore } from "@/stores/search"
import type { CategorizedShows } from "@/types"

import ShowModal from "@/components/show-modal"
import ShowsCarousel from "@/components/shows-carousel"
import ShowsGrid from "@/components/shows-grid"

interface ShowsContainerProps {
  shows: CategorizedShows[]
}

const ShowsContainer = ({ shows }: ShowsContainerProps) => {
  // modal store
  const modalStore = useModalStore()

  // search store
  const searchStore = useSearchStore()

  if (searchStore.query.length > 0) {
    return <ShowsGrid shows={searchStore.shows} />
  }

  return (
    <div className="w-full space-y-10">
      {modalStore.open ? (
        <ShowModal open={modalStore.open} setOpen={modalStore.setOpen} />
      ) : null}
      {shows.map((item) => (
        <ShowsCarousel
          key={item.title}
          title={item.title}
          shows={item.shows ?? []}
        />
      ))}
    </div>
  )
}

export default ShowsContainer
