import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"

import { getCurrentUser } from "@/lib/session"
import AddProfileForm from "@/components/form/add-profile-form"

export const metadata: Metadata = {
  title: "Add Profile",
  description: "Add a new profile",
}

export default async function AddProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  return (
    <section className="w-full">
      <AddProfileForm />
    </section>
  )
}
