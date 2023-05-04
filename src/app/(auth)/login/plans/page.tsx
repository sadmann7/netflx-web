import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/server/auth"

import { plansConfig } from "@/config/plans"
import { getCurrentUser } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import BillingForm from "@/components/forms/billing-form"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Plans",
  description: "Choose the plan that’s right for you",
}

export default async function PlansPage() {
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

  return (
    <section className="container flex w-full max-w-6xl flex-col gap-5 pb-16 pt-10">
      <h1 className="text-3xl font-bold sm:text-4xl">
        Choose the plan that’s right for you
      </h1>
      <div className="flex w-full flex-col gap-2">
        {plansConfig.perks.map((perk, i) => (
          <div key={i} className="flex items-center">
            <Icons.check
              className="mr-2 h-7 w-7 text-red-600"
              aria-hidden="true"
            />
            <span className="text-neutral-500 dark:text-neutral-400">
              {perk}
            </span>
          </div>
        ))}
      </div>
      <BillingForm
        subscriptionPlan={subscriptionPlan}
        isCanceled={isCanceled}
      />
    </section>
  )
}
