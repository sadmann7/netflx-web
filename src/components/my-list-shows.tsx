"use client"

import { useMounted } from "@/hooks/use-mounted"
import { useMyListStore } from "@/stores/my-list"
import { useSearchStore } from "@/stores/search"
import type { MyListShow } from "@prisma/client"

import ShowsGrid from "@/components/shows-grid"
import ShowSkeleton from "@/components/shows-skeleton"

interface MyListShowsProps {
  shows: MyListShow[]
}

const MyListShows = ({ shows }: MyListShowsProps) => {
  console.log(shows)

  // stores
  const searchStore = useSearchStore()
  const myListStore = useMyListStore()

  // check if component is mounted
  const mounted = useMounted()

  if (!mounted) {
    return <ShowSkeleton variant="without-title" />
  }

  if (!myListStore.shows.length) {
    return (
      <div className="container flex w-full max-w-screen-2xl flex-col gap-2.5">
        <h1 className="text-2xl font-bold sm:text-3xl">Your list is empty</h1>
        <p className="text-slate-400 dark:text-slate-400">
          Add shows and movies to your list to watch them later
        </p>
      </div>
    )
  }

  if (searchStore.query.length > 0) {
    return <ShowsGrid shows={searchStore.shows} />
  }

  return <ShowsGrid shows={myListStore.shows} />
}

export default MyListShows
