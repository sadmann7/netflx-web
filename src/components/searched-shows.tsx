"use client"

import type { Show } from "@/types"

interface SearchedShowsProps {
  shows: Show[]
}

const SearchedShows = ({ shows }: SearchedShowsProps) => {
  console.log(shows)

  return (
    <section className="container w-full max-w-screen-2xl">
      SearchedShows
    </section>
  )
}

export default SearchedShows
