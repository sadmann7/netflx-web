"use client"

import { useModalStore } from "@/stores/modal"
import { useSearchStore } from "@/stores/search"
import type { CategorizedShows } from "@/types"

import Modal from "@/components/modal"
import SearchedShows from "@/components/searched-shows"
import Shows from "@/components/shows"

interface ShowsContainerProps {
  shows: CategorizedShows[]
}

const ShowsContainer = ({ shows }: ShowsContainerProps) => {
  // modal store
  const modalStore = useModalStore()

  // search store
  const searchStore = useSearchStore()

  if (
    !searchStore.isLoading &&
    searchStore.query.length > 0 &&
    searchStore.shows.length > 0
  ) {
    return <SearchedShows shows={searchStore.shows} />
  }

  return (
    <div className="w-full space-y-10">
      {modalStore.open ? (
        <Modal open={modalStore.open} setOpen={modalStore.setOpen} />
      ) : null}
      {shows.map((item) => (
        <Shows key={item.title} title={item.title} shows={item.shows ?? []} />
      ))}
    </div>
  )
}

export default ShowsContainer
