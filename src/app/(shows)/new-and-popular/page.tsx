import type { Metadata } from "next"
import type { CategorizedShows } from "@/types"

import { getNewAndPopularShows } from "@/lib/fetchers"
import ShowsContainer from "@/components/shows-container"

export const metadata: Metadata = {
  title: "New & Popular",
  description: "All new and popular shows grouped by genre",
}

export default async function NewAndPopularPage() {
  const allShows = await getNewAndPopularShows()

  const allShowsByCategory: CategorizedShows[] = [
    {
      title: "New TV Shows",
      shows: allShows.trendingTvs,
    },
    {
      title: "New Movies",
      shows: allShows.trendingMovies,
    },
    {
      title: "Popular TV Shows",
      shows: allShows.popularTvs,
    },
    {
      title: "Popular Movies",
      shows: allShows.popularMovies,
    },
  ]

  return (
    <section className="pb-16 pt-10">
      <ShowsContainer shows={allShowsByCategory} />
    </section>
  )
}
