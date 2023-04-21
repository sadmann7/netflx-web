import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import EditProfileForm from "@/components/form/edit-profile-form"

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your profile",
}

interface PageProps {
  params: {
    profileId: string
  }
}

export default async function EditProfilePage({ params }: PageProps) {
  const { profileId } = params

  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
    },
  })

  if (!profile) {
    redirect("/profiles")
  }

  const icon = await prisma.icon.findUnique({
    where: {
      id: profile.iconId,
    },
  })

  return (
    <section>
      {icon && <EditProfileForm profileId={profileId} icon={icon} />}
    </section>
  )
}
