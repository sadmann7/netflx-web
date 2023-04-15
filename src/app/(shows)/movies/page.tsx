import { Suspense } from "react"
import type { Metadata } from "next"

import { getShows } from "@/lib/fetcher"
import LoadingScreen from "@/components/screens/loading-screen"
import Shows from "@/components/shows"

export const metadata: Metadata = {
  title: "Movies",
  description: "All movies grouped by genre",
}

export default async function MoviesPage() {
  const shows = await getShows("movie")

  return (
    <section className="pb-16 pt-24">
      <Suspense fallback={<LoadingScreen />}>
        <div className="w-full space-y-10">
          <Shows title="Trending Now" shows={shows.trending ?? []} />
          <Shows title="Top Rated" shows={shows.topRated ?? []} />
          <Shows title="Action Thrillers" shows={shows.action ?? []} />
          <Shows title="Comedies" shows={shows.comedy ?? []} />
          <Shows title="Scary Movies" shows={shows.horror ?? []} />
          <Shows title="Romance Movies" shows={shows.romance ?? []} />
          <Shows title="Documentaries" shows={shows.docs ?? []} />
        </div>
      </Suspense>
    </section>
  )
}
