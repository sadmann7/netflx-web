import type { Metadata } from "next"

import { plansConfig } from "@/config/plans"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Icons } from "@/components/icons"
import Plans from "@/components/plans"

export const metadata: Metadata = {
  title: "Plans",
  description: "Choose the plan that’s right for you",
}

export default async function PlansPage() {
  const user = await getCurrentUser()

  if (user) {
    // find user in db by id
    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })
  }

  return (
    <section className="container flex w-full max-w-6xl flex-col gap-5 pb-16 pt-10">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Choose the plan that’s right for you
      </h1>
      <div className="flex w-full flex-col space-y-2">
        {plansConfig.perks.map((perk, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Icons.check className="h-7 w-7 text-red-600" aria-hidden="true" />
            <span className="text-gray-500 dark:text-gray-400">{perk}</span>
          </div>
        ))}
      </div>
      <Plans />
    </section>
  )
}
