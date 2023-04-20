import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"

import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Manage Profiles",
  description: "Manage your profiles",
}

export default async function ManageProfilesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  return (
    <section className="container w-full max-w-5xl pb-16 pt-8">
      Manage Profiles
    </section>
  )
}
