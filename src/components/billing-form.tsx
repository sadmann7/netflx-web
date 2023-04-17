"use client"

import { useState } from "react"
import type { UserSubscriptionPlan } from "@/types"

import { plansConfig } from "@/config/plans"
import { cn } from "@/lib/utils"

interface BillingFormProps {
  subscriptionPlan: UserSubscriptionPlan | null
  isCanceled: boolean
}

const BillingForm = ({ subscriptionPlan, isCanceled }: BillingFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState(plansConfig.plans[0])

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
            {plan.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BillingForm
