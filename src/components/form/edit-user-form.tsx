"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/api"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface EditUserFormProps {
  user: Pick<User, "id" | "email" | "phoneNumber">
}

const schema = z.object({
  email: z.string().email(),
  phoneNumber: z
    .string()
    .refine((value) => {
      const regex =
        value === ""
          ? /^$/
          : /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
      return regex.test(value)
    }, "Invalid phone number")

    .optional()
    .nullable(),
})
type Inputs = z.infer<typeof schema>

const EditUserForm = ({ user }: EditUserFormProps) => {
  const apiUtils = api.useContext()

  // update profile mutation
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: async () => {
      await apiUtils.user.getCurrent.invalidate()
      toast.success("Account updated successfully")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // react-hook-form
  const { register, handleSubmit, formState } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    await updateUserMutation.mutateAsync({
      id: user.id,
      email: data.email,
      phoneNumber:
        data.phoneNumber && data.phoneNumber.length > 0
          ? data.phoneNumber
          : null,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2.5">
        <h1 className="text-3xl sm:text-4xl">Account</h1>
        <div className="flex items-center gap-2.5">
          <Icons.edit2 className="h-6 w-6 text-neutral-500" />
          <p className="text-sm font-medium text-neutral-500">
            Update your account details.
          </p>
        </div>
      </div>
      <Separator className="bg-neutral-600" />
      <form
        className="mt-2 grid w-full gap-5"
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      >
        <fieldset className="grid w-full items-start gap-2">
          <label htmlFor="accountEmail" className="text-sm sm:text-base">
            Account Email:
          </label>
          <Input
            id="accountEmail"
            type="text"
            placeholder="Account Email"
            className="rounded-none"
            {...register("email", { required: true })}
            defaultValue={user.email as string}
          />
          {formState.errors.email && (
            <p className="text-sm text-red-500 dark:text-red-500">
              {formState.errors.email.message}
            </p>
          )}
        </fieldset>
        <fieldset className="grid w-full items-start gap-3.5">
          <label htmlFor="accountPhoneNumber" className="text-sm sm:text-base">
            Account Phone Number:
          </label>
          <Input
            id="accountPhoneNumber"
            type="text"
            placeholder="Account Phone Number"
            className="rounded-none"
            {...register("phoneNumber")}
            defaultValue={user.phoneNumber as string}
          />
          {formState.errors.phoneNumber && (
            <p className="-mt-1.5 text-sm text-red-500 dark:text-red-500">
              {formState.errors.phoneNumber.message}
            </p>
          )}
        </fieldset>
        <Button
          aria-label="Save profile"
          variant="flat"
          size="auto"
          className="active:scale-[0.98]"
          disabled={updateUserMutation.isLoading}
        >
          {updateUserMutation.isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Save
        </Button>
      </form>
    </div>
  )
}

export default EditUserForm
