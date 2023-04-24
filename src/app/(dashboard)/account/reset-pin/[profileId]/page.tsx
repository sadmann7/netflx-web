import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Reset Profile Pin",
  description: "Reset your profile pin.",
}

interface ResetPinPageProps {
  params: {
    profileId: string
  }
}

export default async function ResetPinPage({ params }: ResetPinPageProps) {
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
      pin: true,
    },
  })

  if (!profile) {
    notFound()
  }

  return (
    <section className="container min-h-screen w-full max-w-5xl items-center justify-center pb-16 pt-10">
      <div>
        <h1 className="text-center text-3xl font-medium sm:text-4xl">
          Profile Lock
        </h1>
      </div>
    </section>
  )
}
