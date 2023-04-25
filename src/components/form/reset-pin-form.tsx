"use client"

import { useRouter } from "next/navigation"
import { useProfileStore } from "@/stores/profile"
import type { PickedProfile } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/api"
import CheckboxInput from "@/components/checkbox-input"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const schema = z.object({
  pin: z
    .number()
    .refine((v) => v >= 1000 && v <= 9999, {
      message: "Your PIN must be 4 numbers.",
    })
    .optional()
    .nullable(),
  pinStatus: z.boolean(),
})

type Inputs = z.infer<typeof schema>

interface ResetPinFormProps {
  profile: PickedProfile
}

const ResetPinForm = ({ profile }: ResetPinFormProps) => {
  const router = useRouter()
  const apiUtils = api.useContext()

  // profile query
  const profileQuery = api.profile.getOne.useQuery(profile.id, {
    enabled: !!profile.id,
  })

  // update pin mutation
  const updatePinMutation = api.profile.updatePin.useMutation({
    onSuccess: async () => {
      await apiUtils.profile.getOne.invalidate()
      await apiUtils.profile.getAll.invalidate()
      await apiUtils.profile.getOthers.invalidate()
      profileQuery.data &&
        useProfileStore.setState({
          profile: {
            ...profileQuery.data,
            pin: watch("pinStatus") ? watch("pin") ?? null : null,
          },
          pinForm: watch("pinStatus"),
        })
      router.push("/")
      toast.success("Pin updated")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // react-hook-form
  const { register, handleSubmit, formState, control, watch } = useForm<Inputs>(
    {
      resolver: zodResolver(schema),
    }
  )

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    await updatePinMutation.mutateAsync({
      id: profile.id,
      pin: data.pinStatus ? data.pin ?? null : null,
      pinStatus: data.pinStatus,
    })
  }

  return (
    <form
      className="grid w-full gap-8"
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
    >
      <fieldset className="grid w-full items-start gap-2.5">
        <CheckboxInput
          control={control}
          name="pinStatus"
          id="pinStatus"
          label="Require a PIN to access Sadman's profile."
          defaultChecked={!!profile.pin}
        />
        {formState.errors.pinStatus && (
          <p className="text-sm text-red-500 dark:text-red-500">
            {formState.errors.pinStatus.message}
          </p>
        )}
      </fieldset>
      {(watch("pin") === undefined || watch("pin")) &&
        (watch("pinStatus") === undefined || watch("pinStatus")) && (
          <fieldset className="grid w-full items-start gap-2.5">
            <label htmlFor="pin" className="sr-only">
              Profile Lock PIN
            </label>
            <Input
              id="pin"
              type="text"
              placeholder="Profile Lock PIN"
              className="max-w-[6.25rem] rounded-none"
              {...register("pin", {
                setValueAs: (v: string) =>
                  v === "" ? undefined : parseInt(v, 10),
              })}
              defaultValue={profile?.pin ? profile.pin : ""}
            />
            {formState.errors.pin && (
              <p className="text-sm text-red-500 dark:text-red-500">
                {formState.errors.pin.message}
              </p>
            )}
          </fieldset>
        )}

      <div className="mt-20 flex items-center justify-center gap-2">
        <Button
          aria-label="Save profile"
          variant="flat"
          size="auto"
          className="rounded active:scale-[0.98]"
          disabled={updatePinMutation.isLoading}
        >
          {updatePinMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Save
        </Button>
        <Button
          aria-label="Cancel"
          type="button"
          variant="outline"
          size="auto"
          className="rounded active:scale-[0.98]"
          onClick={() => router.push("/account")}
          disabled={updatePinMutation.isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default ResetPinForm
