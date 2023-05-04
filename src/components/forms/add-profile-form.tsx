"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { PickedIcon, PickedProfile } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import ProfilePicker from "@/components/icon-picker"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const schema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
})
type Inputs = z.infer<typeof schema>

interface AddProfileFormProps {
  profiles: PickedProfile[]
  profileIcon: PickedIcon
}

const AddProfileForm = ({ profiles, profileIcon }: AddProfileFormProps) => {
  const router = useRouter()
  const apiUtils = api.useContext()

  const [iconPicker, setIconPicker] = React.useState(false)
  const [icon, setIcon] = React.useState(profileIcon)

  // create profile mutation
  const createProfileMutation = api.profile.create.useMutation({
    onSuccess: async () => {
      await apiUtils.profile.getAll.invalidate()
      await apiUtils.profile.getOthers.invalidate()
      router.push("/profiles")
      toast.success("Profile created")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // react-hook-form
  const { register, handleSubmit, formState, watch, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    await createProfileMutation.mutateAsync({
      name: data.name,
      iconId: icon.id,
    })
    reset()
  }

  return (
    <AnimatePresence>
      {iconPicker ? (
        <ProfilePicker
          icon={icon}
          setIconPicker={setIconPicker}
          setIcon={setIcon}
        />
      ) : (
        <motion.div
          className="container flex min-h-screen w-full max-w-2xl flex-col justify-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-3">
            <h1 className="text-3xl font-medium sm:text-5xl">Add Profile</h1>
            <p className="text-sm text-neutral-500 sm:text-base">
              Add a profile for another person watching Netflix.
            </p>
          </div>
          <Separator className="bg-neutral-700" />
          <form
            className="mt-2 grid w-full gap-5"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center">
              <Button
                aria-label="Show profile picker"
                type="button"
                className="relative aspect-square h-24 w-fit overflow-hidden rounded p-0 hover:opacity-80 active:scale-90 sm:h-28 md:h-32"
                onClick={() => setIconPicker(true)}
                disabled={
                  profiles.length >= 5 || createProfileMutation.isLoading
                }
              >
                <Image
                  src={icon.href}
                  alt={icon.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 
                    (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
              </Button>
              <fieldset className="grid w-full flex-1 items-start gap-2">
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="rounded-none"
                  {...register("name", { required: true })}
                />
                {formState.errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-500">
                    {formState.errors.name.message}
                  </p>
                )}
              </fieldset>
            </div>
            <Separator className="my-1 bg-neutral-700" />
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Button
                aria-label="Add profile"
                variant="flat"
                size="auto"
                className={cn(
                  watch("name")?.length > 0 &&
                    "bg-red-500 text-slate-900 dark:bg-red-600 dark:text-slate-50"
                )}
                disabled={createProfileMutation.isLoading}
              >
                {createProfileMutation.isLoading && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Continue
              </Button>
              <Button
                aria-label="Cancel"
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddProfileForm
