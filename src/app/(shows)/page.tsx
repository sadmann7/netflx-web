import type { CategorizedShows } from "@/types"

import { getShows } from "@/lib/fetchers"
import { getCurrentUser } from "@/lib/session"
import Hero from "@/components/hero"
import ShowsContainer from "@/components/shows-container"

export default async function Home() {
  const user = await getCurrentUser()

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
    <section>
      <div className="pb-16 pt-10">
        <Hero shows={allShows.netflix ?? []} />
        <ShowsContainer user={user} shows={allShowsByCategory} />
      </div>
    </section>
  )
}
