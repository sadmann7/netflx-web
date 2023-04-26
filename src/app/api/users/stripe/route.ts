import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { subscriptionPlans } from "@/config/subscriptions"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { absoluteUrl } from "@/lib/utils"

const successUrl = absoluteUrl("/")
const billingUrl = absoluteUrl("/login/plans")

export async function POST(req: Request) {
  try {
    // Get stripe price id from request body
    const { planName } = (await req.json()) as { planName: string }
    console.log(planName)

    // Find stripe price id from plan name
    const stripePriceId = subscriptionPlans.find(
      (plan) => plan.name === planName
    )?.stripePriceId

    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

    // The user is already subscribed to the plan.
    // Create a portal session to manage subscription.
    if (
      subscriptionPlan?.stripeSubscriptionId &&
      subscriptionPlan?.stripePriceId === stripePriceId
    ) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId ?? "",
        return_url: billingUrl,
      })

      return new Response(JSON.stringify({ url: stripeSession.url }))
    }

    // The user is not subscribed.
    // Create a checkout session to upgrade.
    console.log("creating stripe checkout session")
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    })

    // If the checkout session is successful, then create a profile for the user.
    // Check if profile exists first.
    console.log("creating profile if not exists")
    const existingProfile = await prisma.profile.findUnique({
      where: { id: session.user.id },
    })

    // Set random unused icon for user
    const unusedIcons = await prisma.icon.findMany({
      where: {
        NOT: {
          profiles: {
            every: {
              userId: session.user.id,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        href: true,
      },
    })
    const randomIcon =
      unusedIcons && unusedIcons[Math.floor(Math.random() * unusedIcons.length)]

    // TODO: check if payment is successful before creating profile
    if (!existingProfile) {
      await prisma.profile.create({
        data: {
          user: { connect: { id: session.user.id } },
          id: session.user.id,
          name: session.user.name ?? "",
          icon: { connect: { id: randomIcon?.id } },
        },
      })
    }

    return new Response(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
