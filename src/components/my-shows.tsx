"use client"

import { useMyListStore } from "@/stores/my-list"

import ShowsGrid from "@/components/shows-grid"

const MyShows = () => {
  // my list store
  const myListStore = useMyListStore()

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

  return <ShowsGrid shows={myListStore.shows} />
}

export default MyShows
