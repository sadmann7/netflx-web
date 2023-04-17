"use client"

import * as React from "react"
import Link from "next/link"
import type { UserSubscriptionPlan } from "@/types"
import { toast } from "react-hot-toast"

import { plansConfig } from "@/config/plans"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface BillingFormProps {
  subscriptionPlan: UserSubscriptionPlan | null
  isCanceled: boolean
}

const BillingForm = ({ subscriptionPlan, isCanceled }: BillingFormProps) => {
  const [selectedPlan, setSelectedPlan] = React.useState(
    plansConfig.plans[plansConfig.plans.length - 1]
  )
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleSubscription() {
    console.log("handleSubscription")

    setIsLoading(true)

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

    setIsLoading(false)
  }

  return (
    <div className="flex h-full w-full flex-col gap-8 overflow-x-auto">
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
      <div className="flex flex-col gap-2 text-sm font-medium text-gray-500">
        <p>
          HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject
          to your internet service and device capabilities. Not all content is
          available in all resolutions. See our{" "}
          <Link
            href="/terms-of-use"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            Terms of Use
          </Link>{" "}
          for more details.
        </p>
        <p>
          Only people who live with you may use your account. Watch on 4
          different devices at the same time with Premium, 2 with Standard, and
          1 with Basic and Mobile.
        </p>
      </div>
      <Button
        variant="brand"
        className="mx-auto w-full max-w-xs rounded"
        onClick={() => void handleSubscription()}
        disabled={isLoading}
      >
        {isLoading && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {subscriptionPlan &&
        !isCanceled &&
        subscriptionPlan.name === selectedPlan?.name
          ? "Update"
          : "Subscribe"}
      </Button>
    </div>
  )
}

export default BillingForm
