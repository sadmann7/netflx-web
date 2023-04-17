"use client"

import type { Show } from "@/types"

interface SearchedShowsProps {
  shows: Show[]
}

const SearchedShows = ({ shows }: SearchedShowsProps) => {
  console.log(shows)

  return <div>SearchedShows</div>
}

export default SearchedShows
