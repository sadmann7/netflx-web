"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type {
  ProfileWithIcon,
  SubscriptionPlan,
  UserSubscriptionPlan,
} from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { LANGUAGE } from "@prisma/client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/api"
import { formatDate } from "@/lib/utils"
import { Icons } from "@/components/icons"
import SelectInput from "@/components/select-input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface AccountFormProps {
  subscriptionPlan: UserSubscriptionPlan | null
  subPlanDetails?: SubscriptionPlan
  subStartDate: number | null
  isCanceled: boolean
}

const AccountForm = ({
  subscriptionPlan,
  subPlanDetails,
  subStartDate,
  isCanceled,
}: AccountFormProps) => {
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
  const userQuery = api.user.getCurrentWithProfile.useQuery()

  if (userQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-32 bg-neutral-600" />
        <Skeleton className="h-8 w-40 bg-neutral-600" />
        <Separator className="bg-neutral-600" />
        <div className="flex flex-col gap-5">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 bg-neutral-600" />
            <Skeleton className="h-8 w-32 bg-neutral-600" />
          </div>
          <Separator className="bg-neutral-700" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-8 w-32 bg-neutral-600" />
            <Skeleton className="h-8 w-32 bg-neutral-600" />
          </div>
        </div>
        <Separator className="bg-neutral-700" />
        <Skeleton className="h-8 bg-neutral-600" />
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
      <Separator className="bg-neutral-600" />
      {userQuery.data && (
        <div className="flex flex-col gap-5 text-neutral-100">
          <div className="space-y-5">
            <h2 className="text-lg text-neutral-400 sm:text-xl">
              MEMBERSHIP & BILLING
            </h2>
            <p>{userQuery.data?.email}</p>
          </div>
          <Separator className="bg-neutral-700" />
          <Link
            aria-label="Navigate to update account page"
            href={`/account/users/${userQuery.data.id}`}
            className="flex items-center justify-between gap-4 hover:underline"
          >
            Update account
            <Icons.chevronRight className="h-5 w-5 text-neutral-500" />
          </Link>
          <Separator className="bg-neutral-700" />
          {!subscriptionPlan?.stripeSubscriptionId ? (
            <div className="flex flex-col gap-2.5">
              <p>You are not currently subscribed to any plan.</p>
              <p>
                Some errors must have occured during the subscription process,
                or you might have canceled your subscription.
              </p>
              <p>
                Either way, you can subscribe again by clicking{" "}
                <Link
                  href="/login/plans"
                  className="cursor-pointer text-blue-400 hover:underline"
                >
                  here
                </Link>
                .
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
          {subscriptionPlan ? (
            <>
              <Button
                type="button"
                aria-label="Cancel membership"
                variant="flat"
                className="rounded-none"
                onClick={() => void handleSubscription()}
              >
                {isLoading && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isCanceled ? "Renew Membership" : "Cancel Membership"}
              </Button>
              <Separator className="bg-neutral-600" />
            </>
          ) : null}
          <div className="space-y-5">
            <h2 className="text-lg text-neutral-400 sm:text-xl">
              PLAN DETAILS
            </h2>
            <div className="flex items-center gap-2">
              <p>{subscriptionPlan?.name}</p>
              <span className="rounded-sm px-1 text-neutral-100 ring-2 ring-slate-100">
                {subPlanDetails?.resolution}
              </span>
            </div>
          </div>
          <Separator className="bg-neutral-700" />
          <Link
            aria-label="Navigate to plans page"
            href="/login/plans"
            className="flex items-center justify-between gap-4 hover:underline"
          >
            Change plan
            <Icons.chevronRight className="h-5 w-5 text-neutral-400" />
          </Link>
          <Separator className="bg-neutral-600" />
          <div className="space-y-2">
            <h2 className="text-lg text-neutral-400 sm:text-xl">PROFILE</h2>
            <Accordion type="single" collapsible className="w-full">
              {userQuery.data?.profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountForm

const schema = z.object({
  email: z.string().optional(),
  language: z.nativeEnum(LANGUAGE),
  pin: z
    .number()
    .refine((v) => v >= 1000 && v <= 9999, {
      message: "Your PIN must be 4 numbers.",
    })
    .optional()
    .nullable(),
})
type Inputs = z.infer<typeof schema>

const ProfileCard = ({ profile }: { profile: ProfileWithIcon }) => {
  const apiUtils = api.useContext()

  // update profile mutation
  const updateProfileMutation = api.profile.update.useMutation({
    onSuccess: async () => {
      await apiUtils.user.getCurrentWithProfile.invalidate()
      await apiUtils.profile.getAll.invalidate()
      await apiUtils.profile.getOthers.invalidate()
      toast.success("Profile updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // react-hook-form
  const { register, handleSubmit, formState, control } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    await updateProfileMutation.mutateAsync({
      id: profile?.id,
      name: profile?.name,
      iconId: profile?.icon?.id,
      language: data.language,
      email: data.email,
      gameHandle: profile?.gameHandle ?? null,
      pin: data.pin ?? null,
    })
  }

  return (
    <>
      <AccordionItem value={profile.id} className="border-neutral-700">
        <AccordionTrigger>
          <div className="flex items-center gap-4">
            <Image
              src={profile.icon.href}
              alt={profile.icon.title}
              width={60}
              height={60}
              className="rounded object-cover"
              loading="lazy"
            />
            <p>{profile.name}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-1">
          <form
            className="mt-2 grid w-full gap-5"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <fieldset className="grid w-full items-start gap-2">
              <label htmlFor="email" className="text-sm sm:text-base">
                Profile Email:
              </label>
              <Input
                id="email"
                type="text"
                placeholder="Profile Email"
                className="rounded-none"
                {...register("email")}
                defaultValue={profile?.email as string}
              />
              {formState.errors.email && (
                <p className="text-sm text-red-500 dark:text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
            </fieldset>
            <fieldset className="grid w-full items-start gap-2">
              <label htmlFor="language" className="text-sm sm:text-base">
                Language:
              </label>
              <SelectInput
                control={control}
                name="language"
                options={Object.values(LANGUAGE)}
                defaultValue={profile?.language}
              />
              {formState.errors.language && (
                <p className="text-sm text-red-500 dark:text-red-500">
                  {formState.errors.language.message}
                </p>
              )}
            </fieldset>
            <fieldset className="grid w-full items-start gap-3.5">
              <label htmlFor="pin" className="text-sm sm:text-base">
                Profile Lock PIN:
              </label>
              <Input
                id="pin"
                type="text"
                placeholder="Profile Lock PIN"
                className="rounded-none"
                {...register("pin", {
                  setValueAs: (v: string) =>
                    v === "" ? undefined : parseInt(v, 10),
                })}
                defaultValue={profile?.pin as number}
              />
              {formState.errors.pin && (
                <p className="-mt-1.5 text-sm text-red-500 dark:text-red-500">
                  {formState.errors.pin.message}
                </p>
              )}
            </fieldset>
            <Button
              aria-label="Save profile"
              variant="flat"
              size="auto"
              className="active:scale-[0.98]"
              disabled={updateProfileMutation.isLoading}
            >
              {updateProfileMutation.isLoading && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </>
  )
}
