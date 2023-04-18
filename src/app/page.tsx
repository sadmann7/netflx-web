import { Suspense } from "react"
import type { CategorizedShows } from "@/types"

import { getShows } from "@/lib/fetcher"
import Hero from "@/components/hero"
import LoadingScreen from "@/components/screens/loading-screen"
import ShowsContainer from "@/components/shows-container"

export default async function Home() {
  const allShows = await getShows("movie")

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
      <Suspense fallback={<LoadingScreen />}>
        <Hero shows={allShows.netflix ?? []} />
        <ShowsContainer shows={allShowsByCategory} />
      </Suspense>
    </section>
  )
}
