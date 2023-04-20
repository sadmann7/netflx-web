import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import Profiles from "@/components/profiles"

export const metadata: Metadata = {
  title: "Manage Profiles",
  description: "Manage your profiles",
}

export default async function ManageProfilesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  const profiles = await prisma.profile.findMany({
    where: {
      id: user.id,
    },
  })

  return (
    <section className="w-full shadow-md">
      <Profiles profiles={profiles} />
    </section>
  )
}
