import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/server/db"
import { useProfileStore } from "@/stores/profile"

import { getCurrentUser } from "@/lib/session"
import MyListShows from "@/components/my-list-shows"

export const metadata: Metadata = {
  title: "My List",
  description: "All TV shows and movies you've added to your list",
}

export default async function MyListPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const shows = await prisma.myListShow.findMany({
    where: {
      profileId: useProfileStore.getState().profile?.id,
    },
  })

  return (
    <section className="pb-16 pt-10">
      <MyListShows shows={shows} />
    </section>
  )
}
