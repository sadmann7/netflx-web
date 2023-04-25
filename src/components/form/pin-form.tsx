import * as React from "react"
import Link from "next/link"
import { useProfileStore } from "@/stores/profile"
import PinInput from "react-pin-input"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"

const PinForm = () => {
  const profileStore = useProfileStore()

  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(value: string) {
    if (!profileStore.profile) return
    setError(null)

    profileStore.profile.pin === Number(value)
      ? profileStore.setPinForm(false)
      : setError("Incorrect PIN")
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-0 top-8 rounded-none"
        onClick={() => {
          useProfileStore.setState({ pinForm: false, profile: null })
        }}
      >
        <Icons.close className="h-6 w-6" aria-hidden="true" />
      </Button>
      <div className="flex flex-col items-center gap-2.5">
        <div className="text-center text-base font-medium text-neutral-400 sm:text-lg">
          Profile Lock is currently on.
        </div>
        <h1
          className={cn(
            "text-center text-3xl font-semibold md:text-4xl",
            error && "text-yellow-500"
          )}
        >
          {error
            ? "Whoops, wrong PIN. Please try again."
            : "Enter your PIN to access your profile."}
        </h1>
      </div>
      <fieldset className="grid w-full place-items-center gap-2">
        <label htmlFor="pin" className="sr-only">
          PIN
        </label>
        <PinInput
          length={4}
          secret
          secretDelay={100}
          type="numeric"
          inputMode="number"
          style={{ padding: "10px" }}
          inputStyle={{
            borderColor: "white",
            margin: "0.25rem",
            width: "4rem",
            height: "4rem",
          }}
          inputFocusStyle={{
            borderColor: "slategray",
            scale: 1.1,
            transition: "scale 0.3s ease",
          }}
          onChange={(value) => {
            console.log(isNaN(Number(value)))
          }}
          onComplete={(value) => handleSubmit(value)}
          autoSelect={true}
          focus
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
        <div className="text-base font-medium text-red-500 dark:text-red-500 sm:text-lg">
          Your PIN must be 4 numbers.
        </div>
      </fieldset>
      {profileStore.profile && (
        <Link
          href={`/account/reset-pin/${profileStore.profile.id}`}
          className={buttonVariants({
            variant: "ghost",
            className: "mt-10 rounded-none",
          })}
        >
          Forgot PIN?
        </Link>
      )}
    </div>
  )
}

export default PinForm
