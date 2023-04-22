"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type { SubscriptionPlan, UserSubscriptionPlan } from "@/types"
import { toast } from "react-hot-toast"

import { api } from "@/lib/api/api"
import { formatDate } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface AccountProps {
  subscriptionPlan: UserSubscriptionPlan | null
  subPlanDetails?: SubscriptionPlan
  subStartDate: number | null
  isCanceled: boolean
}

const Account = ({
  subscriptionPlan,
  subPlanDetails,
  subStartDate,
  isCanceled,
}: AccountProps) => {
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
        planName: subscriptionPlan?.name,
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

  // user query
  const userQuery = api.profile.getUserWithProfile.useQuery()

  if (userQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 bg-neutral-700" />
        ))}
      </div>
    )
  }

  if (userQuery.isError) {
    return (
      <div className="text-lg text-red-500 sm:text-xl">
        Error: {userQuery.error.message}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2.5">
        <h1 className="text-3xl sm:text-4xl">Account</h1>
        <div className="flex items-center gap-2.5">
          <Icons.billing className="h-6 w-6 text-neutral-500" />
          <p className="text-sm font-medium text-neutral-500">
            Member since {subStartDate ? formatDate(subStartDate) : "N/A"}
          </p>
        </div>
      </div>
      <Separator className="bg-neutral-700" />
      <div className="flex flex-col gap-5 text-neutral-100">
        <div className="space-y-7">
          <h2 className="text-lg text-neutral-400 sm:text-xl">
            MEMBERSHIP & BILLING
          </h2>
          <p>{userQuery.data?.email}</p>
        </div>
        <Separator className="bg-neutral-800" />
        <Link
          aria-label="Navigate to update account page"
          href="/account/update"
          className="flex items-center justify-between gap-4 hover:underline"
        >
          Update account
          <Icons.chevronRight className="h-5 w-5 text-neutral-500" />
        </Link>
        <Separator className="bg-neutral-700" />
        {subscriptionPlan === null ? (
          <div className="flex flex-col gap-2.5">
            <p>You are not currently subscribed to any plan.</p>
            <p>
              Click{" "}
              <Link
                href="/login/plans"
                className="cursor-pointer text-blue-400 hover:underline"
              >
                here
              </Link>{" "}
              to subscribe.
            </p>
          </div>
        ) : (
          <p>
            {isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
            {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
          </p>
        )}
        <Separator className="bg-neutral-700" />
        <Button
          type="button"
          aria-label="Cancel membership"
          variant="flat"
          size="lg"
          className="rounded-none"
          onClick={() => void handleSubscription()}
        >
          Cancel Membership
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
        </Button>
        <Separator className="bg-neutral-700" />
        <div className="space-y-7">
          <h2 className="text-lg text-neutral-400 sm:text-xl">PLAN DETAILS</h2>
          <div className="flex items-center gap-2">
            <p>{subscriptionPlan?.name}</p>
            <span className="rounded-sm px-1 text-neutral-100 ring-2 ring-slate-100">
              {subPlanDetails?.resolution}
            </span>
          </div>
        </div>
        <Separator className="bg-neutral-800" />
        <Link
          aria-label="Navigate to plans page"
          href="/login/plans"
          className="flex items-center justify-between gap-4 hover:underline"
        >
          Change plan
          <Icons.chevronRight className="h-5 w-5 text-neutral-400" />
        </Link>
        <Separator className="bg-neutral-700" />
        <div className="space-y-7">
          <h2 className="text-lg text-neutral-400 sm:text-xl">PROFILE</h2>
          <div className="flex flex-col gap-2">
            {userQuery.data?.profiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-7">
                <Image
                  src={profile.icon.href}
                  alt={profile.icon.title}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
                <p className="flex-1">{profile.name}</p>
                <Icons.chevronDown className="h-5 w-5 text-neutral-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
