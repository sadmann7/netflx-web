import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"

import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your profile",
}

export default async function EditProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  return <section className="w-full">Edit Profile</section>
}
