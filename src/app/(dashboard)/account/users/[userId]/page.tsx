import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"

import { getCurrentUser } from "@/lib/session"
import EditUserForm from "@/components/forms/edit-user-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Update Account",
  description: "Update your account details.",
}

interface EditAccountPageProps {
  params: {
    userId: string
  }
}

export default async function EditAccountPage({
  params,
}: EditAccountPageProps) {
  const { userId } = params

  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
    },
  })

  if (!dbUser) {
    notFound()
  }

  return (
    <section className="container w-full max-w-3xl pb-16 pt-10">
      <Suspense
        fallback={
          <div className="flex flex-col gap-5">
            <Skeleton className="h-8 w-32 bg-neutral-600" />
            <Skeleton className="h-8 w-40 bg-neutral-600" />
            <div className="flex flex-col gap-5">
              <Skeleton className="h-8 bg-neutral-600" />
              <Skeleton className="h-8 bg-neutral-600" />
              <Skeleton className="h-8 bg-neutral-600" />
            </div>
          </div>
        }
      >
        <EditUserForm user={dbUser} />
      </Suspense>
    </section>
  )
}
