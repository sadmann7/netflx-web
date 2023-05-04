import * as React from "react"
import { useRouter } from "next/navigation"
import { useProfileStore } from "@/stores/profile"
import PinInput from "react-pin-input"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

const PinForm = () => {
  const router = useRouter()
  const profileStore = useProfileStore()

  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(value: string) {
    if (!profileStore.profile) return

    if (profileStore.profile.pin === Number(value)) {
      setError(null)
      profileStore.setPinForm(false)
      router.push("/")
    } else {
      setError("Incorrect PIN")
    }
  }

  console.log(profileStore.profile)

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8">
      <Button
        aria-label="Close menu"
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
          onComplete={(value) => handleSubmit(value)}
          autoSelect={true}
          focus
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
        <div className="text-base font-medium text-red-500 dark:text-red-500 sm:text-lg">
          Your PIN must be 4 numbers.
        </div>
      </fieldset>
      <Button
        aria-label="Navigate to reset pin page"
        type="button"
        variant="ghost"
        className="mt-10 rounded-none"
        onClick={() => {
          if (!profileStore.profile) return
          router.push(`/account/reset-pin/${profileStore.profile.id}`)
        }}
        disabled={!profileStore.profile}
      >
        Forgot PIN?
      </Button>
    </div>
  )
}

export default PinForm
