import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import AddProfileForm from "@/components/forms/add-profile-form"

export const metadata: Metadata = {
  title: "Add Profile",
  description: "Add a new profile",
}

export default async function AddProfilePage() {
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
      pin: true,
      email: true,
      icon: true,
    },
  })

  const unusedIcons = await prisma.icon.findMany({
    where: {
      NOT: {
        profiles: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      href: true,
    },
  })
  const randomIcon =
    unusedIcons && unusedIcons[Math.floor(Math.random() * unusedIcons.length)]

  if (!profiles || !randomIcon) {
    redirect("/profiles")
  }

  return (
    <section>
      <AddProfileForm profiles={profiles} profileIcon={randomIcon} />
    </section>
  )
}
