"use client"

import { usePathname } from "next/navigation"
import { useMounted } from "@/hooks/use-mounted"
import { useModalStore } from "@/stores/modal"
import { useMyListStore } from "@/stores/my-list"
import { useSearchStore } from "@/stores/search"
import type { CategorizedShows } from "@/types"

import LoadingScreen from "@/components/screens/loading-screen"
import ShowModal from "@/components/show-modal"
import ShowsCarousel from "@/components/shows-carousel"
import ShowsGrid from "@/components/shows-grid"

interface ShowsContainerProps {
  shows: CategorizedShows[]
}

const ShowsContainer = ({ shows }: ShowsContainerProps) => {
  const path = usePathname()
  const mounted = useMounted()

  // stores
  const modalStore = useModalStore()
  const searchStore = useSearchStore()
  const myListStore = useMyListStore()

  // check if component is mounted
  if (!mounted) return <LoadingScreen />

  if (searchStore.query.length > 0) {
    return <ShowsGrid shows={searchStore.shows} />
  }

  return (
    <div className="w-full space-y-10">
      {modalStore.open ? (
        <ShowModal open={modalStore.open} setOpen={modalStore.setOpen} />
      ) : null}
      {path === "/" && myListStore.shows.length > 0 ? (
        <ShowsCarousel title="My List" shows={myListStore.shows} />
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
