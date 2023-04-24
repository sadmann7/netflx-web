import { Suspense } from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"

import { getCurrentUser } from "@/lib/session"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Help Center for Netflx",
}

export default async function HelpCenterPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  return (
    <section className="container min-h-screen w-full max-w-3xl items-center justify-center pb-16 pt-10">
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
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-center text-3xl font-medium sm:text-4xl">
            Help Center
          </h1>
          <p className="text-center text-xl font-medium sm:text-2xl">
            How to do a heelflip
          </p>
          <ul className="list-inside list-disc text-xl">
            <li>Push on your skateboard</li>
            <li>
              Place your front foot below the bolts with your toes hanging off
              the board and ball of the foot on the edge of the deck
            </li>
            <li>
              Place your back foot on the tail of the board with the ball right
              on the edge of the deck
            </li>
            <li>
              Adopt a low stance, pop an ollie, and lean back toward your heels
            </li>
            <li>
              As the skateboard starts to rise in the air, slide your front foot
              up the deck
            </li>
            <li>
              As your front foot starts coming off the edge of the board, flick
              it, or press your heel down into the edge of the nose
            </li>
            <li>Watch the board spin around its axis underneath you</li>
            <li>
              When the rotation is complete, catch the board with your back foot
              and immediately put your front foot on it
            </li>
            <li>Drop your legs down to get the board parallel to the ground</li>
            <li>Land the skateboard with your knees bent and roll away</li>
          </ul>
        </div>
      </Suspense>
    </section>
  )
}
