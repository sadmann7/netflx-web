"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { PickedProfile } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { LANGUAGE } from "@prisma/client"
import { useIsMutating } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { api } from "@/lib/api/client"
import { cn } from "@/lib/utils"
import IconPicker from "@/components/icon-picker"
import { Icons } from "@/components/icons"
import SelectInput from "@/components/select-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const schema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  language: z.nativeEnum(LANGUAGE),
  gameHandle: z.string().optional().nullable(),
})
type Inputs = z.infer<typeof schema>

interface EditProfileFormProps {
  profile: PickedProfile
}

const EditProfileForm = ({ profile }: EditProfileFormProps) => {
  const router = useRouter()
  const apiUtils = api.useContext()

  const [iconPicker, setIconPicker] = React.useState(false)
  const [icon, setIcon] = React.useState(profile.icon)

  // update profile mutation
  const updateProfileMutation = api.profile.update.useMutation({
    onSuccess: () => {
      router.push("/profiles")
      toast.success("Profile updated")
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

    await updateProfileMutation.mutateAsync({
      id: profile?.id,
      name: data.name,
      iconId: icon.id,
      language: data.language,
      gameHandle: data.gameHandle,
      email: profile?.email ?? null,
    })
  }

  // delete profile mutation
  const deleteProfileMutation = api.profile.delete.useMutation({
    onSuccess: () => {
      router.push("/profiles")
      toast.success("Profile deleted")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // refetch queries
  const mutationCount = useIsMutating()
  React.useEffect(() => {
    void apiUtils.profile.getAll.invalidate()
    void apiUtils.profile.getOthers.invalidate()
  }, [apiUtils, mutationCount])

  return (
    <AnimatePresence>
      {iconPicker ? (
        <IconPicker
          icon={icon}
          setIconPicker={setIconPicker}
          setIcon={setIcon}
        />
      ) : (
        <motion.div
          className="container flex w-full max-w-3xl flex-col justify-center gap-5 pb-5 pt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-medium sm:text-5xl">Edit Profile</h1>
          <Separator className="bg-neutral-700" />
          <form
            className="mt-2 grid w-full gap-5"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <div className="flex w-full flex-col gap-6 sm:flex-row">
              <Button
                aria-label="Show profile picker"
                type="button"
                className="relative aspect-square h-24 w-fit overflow-hidden rounded p-0 hover:opacity-80 active:scale-90 sm:h-28 md:h-32"
                onClick={() => setIconPicker(true)}
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
              <div className="w-full flex-1 space-y-5">
                <fieldset className="grid w-full items-start gap-2">
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    className="rounded-none"
                    {...register("name", { required: true })}
                    defaultValue={profile?.name}
                  />
                  {formState.errors.name && (
                    <p className="text-sm text-red-500 dark:text-red-500">
                      {formState.errors.name.message}
                    </p>
                  )}
                </fieldset>
                <fieldset className="grid w-full items-start gap-2">
                  <label
                    htmlFor="language"
                    className="text-base text-neutral-400 sm:text-lg"
                  >
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
                  <label htmlFor="gameHandle" className="flex flex-col gap-2">
                    <span className="text-base text-neutral-400 sm:text-lg">
                      Game Handle:
                    </span>
                    <span>
                      Your handle is a unique name {`that'll`} be used for
                      playing with other Netflix members across all Netflix
                      Games. Learn more
                    </span>
                  </label>
                  <Input
                    id="gameHandle"
                    type="text"
                    placeholder="Create Game Handle"
                    className="rounded-none"
                    {...register("gameHandle")}
                    defaultValue={profile?.gameHandle ?? ""}
                  />
                  {formState.errors.gameHandle && (
                    <p className="-mt-1.5 text-sm text-red-500 dark:text-red-500">
                      {formState.errors.gameHandle.message}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
            <Separator className="my-2 bg-neutral-700" />
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Button
                aria-label="Save profile"
                variant="flat"
                size="auto"
                className={cn(
                  watch("name")?.length > 0 &&
                    "bg-red-500 text-slate-50 dark:bg-red-600 dark:text-slate-50"
                )}
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
              <Button
                aria-label="Cancel"
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                aria-label="Delete profile"
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => deleteProfileMutation.mutate(profile?.id)}
                disabled={deleteProfileMutation.isLoading}
              >
                {deleteProfileMutation.isLoading && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Delete Profile
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EditProfileForm
