"use client"

import type { PickedUser, UserSubscriptionPlan } from "@/types"

import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"

interface AccountProps {
  user: PickedUser
  subscriptionPlan: UserSubscriptionPlan | null
  isCanceled: boolean
}

const Account = ({ user, subscriptionPlan, isCanceled }: AccountProps) => {
  return (
    <div>
      <div className="flex items-center gap-5">
        <h1 className="text-3xl sm:text-4xl">Account</h1>
        <div className="flex items-center gap-2.5">
          <Icons.billing className="h-6 w-6 text-neutral-500" />
          <p className="text-sm font-medium text-neutral-500">
            Manage billing and your subscription plan.
          </p>
        </div>
      </div>
      <div className="container flex min-h-screen w-full max-w-2xl flex-col justify-center gap-3">
        <div className="space-y-3">
          <h1 className="text-3xl font-medium sm:text-5xl">Add Profile</h1>
          <p className="text-sm text-neutral-500 sm:text-base">
            Add a profile for another person watching Netflix.
          </p>
        </div>
        <Separator className="bg-neutral-700" />
      </div>
    </div>
  )
}

export default Account
