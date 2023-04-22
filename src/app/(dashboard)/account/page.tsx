import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"
import { PickedUser } from "@/types"
import { User } from "@prisma/client"
import { Separator } from "@radix-ui/react-select"

import { getCurrentUser } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import Account from "@/components/account"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage billing and your subscription plan.",
}

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login")
  }

  // find subscription plan of user
  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  // if user has a subscription plan, check if it's active
  let isCanceled = false
  if (subscriptionPlan && subscriptionPlan.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profiles: {
        select: {
          id: true,
          name: true,
          language: true,
          password: true,
        },
      },
    },
  })

  return (
    <section className="container w-full max-w-screen-2xl pb-16 pt-10">
      {dbUser && (
        <Account
          user={dbUser}
          subscriptionPlan={subscriptionPlan}
          isCanceled={isCanceled}
        />
      )}
    </section>
  )
}
