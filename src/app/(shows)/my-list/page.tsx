import type { Metadata } from "next"

import MyShows from "@/components/my-shows"

export const metadata: Metadata = {
  title: "My List",
  description: "All TV shows and movies you've added to your list",
}

export default function MyListPage() {
  return (
    <section className="pb-16 pt-10">
      <MyShows />
    </section>
  )
}
