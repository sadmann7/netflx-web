import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import EditProfileForm from "@/components/forms/edit-profile-form"

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your profile",
}

interface EditProfilePageProps {
  params: {
    profileId: string
  }
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const { profileId } = params

  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
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

  if (!profile) {
    redirect("/profiles")
  }

  return (
    <section>
      <EditProfileForm profile={profile} />
    </section>
  )
}
