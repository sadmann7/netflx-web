import type { Metadata } from "next"
import type { CategorizedShows } from "@/types"

import { getShows } from "@/lib/fetchers"
import ShowsContainer from "@/components/shows-container"

export const metadata: Metadata = {
  title: "TV Shows",
  description: "All TV shows grouped by genre",
}

export default async function TVShowsPage() {
  const allShows = await getShows("tv")

  const allShowsByCategory: CategorizedShows[] = [
    {
      title: "Trending Now",
      shows: allShows.trending,
    },
    {
      title: "Top Rated",
      shows: allShows.topRated,
    },
    {
      title: "Action Thrillers",
      shows: allShows.action,
    },
    {
      title: "Comedies",
      shows: allShows.comedy,
    },
    {
      title: "Scary Movies",
      shows: allShows.horror,
    },
    {
      title: "Romance Movies",
      shows: allShows.romance,
    },
    {
      title: "Documentaries",
      shows: allShows.docs,
    },
  ]

  return (
    <section className="pb-16 pt-10">
      <ShowsContainer shows={allShowsByCategory} />
    </section>
  )
}
