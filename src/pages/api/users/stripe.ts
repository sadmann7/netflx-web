import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/server/auth"
import { prisma } from "@/server/db"
import { getServerSession } from "next-auth/next"

import { subscriptionPlans } from "@/config/subscriptions"
import { withAuthentication } from "@/lib/api-middlewares/with-authentication"
import { withMethods } from "@/lib/api-middlewares/with-methods"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { absoluteUrl } from "@/lib/utils"

const billingUrl = absoluteUrl("/login/plans")

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // get stripe price id from request body
      const { planName } = req.body as { planName: string }
      console.log(planName)

      // find stripe price id from plan name
      const stripePriceId = subscriptionPlans.find(
        (plan) => plan.name === planName
      )?.stripePriceId

      const session = await getServerSession(req, res, authOptions)
      const user = session?.user

      if (!user || !user.email || !user.id || !user.name) {
        throw new Error("User not found.")
      }

      const subscriptionPlan = await getUserSubscriptionPlan(user.id)

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

        return res.json({ url: stripeSession.url })
      }

      // The user is not subscribed.
      // Create a checkout session to upgrade.
      console.log("creating stripe checkout session")
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email,
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
        },
      })

      console.log(stripeSession.payment_status)

      // If the checkout session is successful, then create a profile for the user.
      // Check if profile exists first.
      console.log("creating profile if not exists")
      const existingProfile = await prisma.profile.findUnique({
        where: { id: user.id },
      })

      // set random icon for user
      const unusedIcons = await prisma.icon.findMany({
        where: {
          NOT: {
            profiles: {
              some: {
                userId: user.id,
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
        unusedIcons &&
        unusedIcons[Math.floor(Math.random() * unusedIcons.length)]
      // TODO: check if stripeSession.payment_status === "paid"
      if (!existingProfile) {
        await prisma.profile.create({
          data: {
            user: { connect: { id: user.id } },
            id: user.id,
            name: user.name,
            icon: { connect: { id: randomIcon?.id } },
          },
        })
      }

      return res.json({ url: stripeSession.url })
    } catch (error) {
      return res.status(500).end()
    }
  }
}

export default withMethods(["POST"], withAuthentication(handler))
