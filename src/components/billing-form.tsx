"use client"

import * as React from "react"
import type { UserSubscriptionPlan } from "@/types"
import { toast } from "react-hot-toast"

import { plansConfig } from "@/config/plans"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BillingFormProps {
  subscriptionPlan: UserSubscriptionPlan | null
  isCanceled: boolean
}

const BillingForm = ({ subscriptionPlan, isCanceled }: BillingFormProps) => {
  const [selectedPlan, setSelectedPlan] = React.useState(plansConfig.plans[0])
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleSubscription() {
    console.log("handleSubscription")

    setIsLoading(!isLoading)

    // Get a Stripe session URL.
    const response = await fetch("/api/users/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planName: selectedPlan?.name,
      }),
    })

    if (!response?.ok) {
      return toast.error(
        "Something went wrong. Please refresh the page and try again."
      )
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = (await response.json()) as { url: string }
    if (session) {
      window.location.href = session.url
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-x-auto">
      <div className="flex min-w-[480px] justify-end gap-5">
        {plansConfig.plans.map((plan, i) => (
          <div
            key={i}
            className={cn(
              "grid aspect-square w-28 cursor-default place-items-center rounded bg-red-600 font-medium",
              selectedPlan === plan ? "opacity-100" : "opacity-70"
            )}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.name}
          </div>
        ))}
      </div>
      <Button onClick={() => void handleSubscription()}>
        {subscriptionPlan && !isCanceled ? "Update" : "Subscribe"}
      </Button>
    </div>
  )
}

export default BillingForm
