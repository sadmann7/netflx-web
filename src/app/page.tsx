import { getShows } from "@/lib/fetcher"
import Hero from "@/components/hero"

export default async function Home() {
  const shows = await getShows("movie")

  return (
    <section className="mb-16">
      <Hero shows={shows.netflix ?? []} />
    </section>
  )
}
