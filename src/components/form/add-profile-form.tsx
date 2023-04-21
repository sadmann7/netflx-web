"use client"

import * as React from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon, Profile } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import ProfilePicker from "@/components/profile-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const schema = z.object({
  name: z.string(),
  image: z.string(),
})
type Inputs = z.infer<typeof schema>

interface AddProfileFormProps {
  profiles: Profile[]
  icon: Icon | null
}

const AddProfileForm = ({ profiles, icon }: AddProfileFormProps) => {
  const [profilePicker, setProfilePicker] = React.useState(false)
  const [iconId, setIconId] = React.useState("")

  // create profile mutation
  const createProfileMutation = api.profile.create.useMutation({
    onMutate: () => toast.success("Profile created"),
    onError: () => toast.error("Failed to create profile"),
  })

  // react-hook-form
  const { register, handleSubmit, formState, watch, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  return (
    <AnimatePresence>
      {profilePicker ? (
        <ProfilePicker
          profilePicker={profilePicker}
          setProfilePicker={setProfilePicker}
          iconId={iconId}
          setIconId={setIconId}
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
          <Separator className="bg-neutral-600" />
          <form
            className="mt-2 grid w-full gap-5"
            onSubmit={() => void handleSubmit(onSubmit)}
          >
            <div className="flex w-full items-center gap-5">
              <Button
                aria-label="Show profile picker"
                type="button"
                className="relative aspect-square h-auto w-32 overflow-hidden rounded p-0 hover:opacity-80 active:scale-90"
                onClick={() => setProfilePicker(true)}
                disabled={!icon || profiles?.length >= 5}
              >
                {icon ? (
                  <Image
                    src={icon.href}
                    alt={icon.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Skeleton className="h-full w-full rounded bg-neutral-700" />
                )}
              </Button>
              <fieldset className="grid w-full gap-5">
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
              </fieldset>
            </div>
            <Separator className="bg-neutral-600" />
            <div className="mt-2 flex items-center gap-4">
              <Button
                aria-label="Add profile"
                variant="flat"
                size="auto"
                className={cn(
                  watch("name")?.length > 0 &&
                    "bg-red-500 text-slate-900 dark:bg-red-600 dark:text-slate-50"
                )}
              >
                Continue
              </Button>
              <Button
                aria-label="Cancel"
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => reset()}
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
