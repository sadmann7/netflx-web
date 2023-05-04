import type { Metadata } from "next"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import ResetPinForm from "@/components/forms/reset-pin-form"

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
    notFound()
  }

  return (
    <section className="container min-h-screen w-full max-w-6xl space-y-8 pb-16 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-center text-2xl font-medium sm:text-3xl">
          Profile Lock
        </h1>
        <Image
          src={profile.icon.href}
          alt={profile.icon.title}
          width={48}
          height={48}
          className="rounded object-cover"
        />
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-medium sm:text-2xl">
          Lock this profile by creating a 4-digit pin.
        </h2>
        <ResetPinForm profile={profile} />
      </div>
    </section>
  )
}
