import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import ManageProfiles from "@/components/manage-profiles"

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
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      language: true,
      gameHandle: true,
      email: true,
      pin: true,
      icon: {
        select: {
          id: true,
          title: true,
          href: true,
        },
      },
    },
  })

  // TODO: refetch profiles on mutation

  return (
    <section className="w-full shadow-md">
      <ManageProfiles profiles={profiles} />
    </section>
  )
}
