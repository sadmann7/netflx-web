import { prisma } from "@/server/db"
import type { UserSubscriptionPlan } from "@/types"

import { subscriptionPlans } from "@/config/subscriptions"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan | null> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // check if user has a subscription
  if (!user.stripeSubscriptionId) return null

  // check if user subscription is active
  if (
    (user.stripeCurrentPeriodEnd as Date)?.getTime() + 86_400_000 <
    Date.now()
  ) {
    return null
  }

  // check if user has a valid subscription plan
  if (!user.stripePriceId) return null

  // find the subscription plan that matches the user's subscription plan
  const subscriptionPlan = subscriptionPlans.find(
    (plan) => plan.stripePriceId === user.stripePriceId
  )

  if (!subscriptionPlan) return null

  return {
    ...subscriptionPlan,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripePriceId: user.stripePriceId,
    stripeCurrentPeriodEnd: (user.stripeCurrentPeriodEnd as Date)?.getTime(),
  }
}

export function getPlanDetails(planName: string) {
  const plan = subscriptionPlans.find((plan) => plan.name === planName)

  // if (!plan) {
  //   throw new Error("Plan not found")
  // }

  return plan
}
