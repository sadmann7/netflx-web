"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Profile } from "@prisma/client"
import { toast } from "react-hot-toast"

import { api } from "@/lib/api/api"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ProfilesProps {
  profiles: Profile[]
}

const Profiles = ({ profiles }: ProfilesProps) => {
  const router = useRouter()

  // update profile mutation
  const updateProfileMutation = api.profile.update.useMutation({
    onMutate: () => toast.success("Profile updated"),
    onError: () => toast.error("Failed to update profile"),
  })

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-medium sm:text-4xl">Manage Profiles:</h1>
      <div className="flex flex-col items-center space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {profiles.map(
            (profile) =>
              profile.image && (
                <Button
                  aria-label={`Edit ${profile.name}`}
                  key={profile.id}
                  variant="ghost"
                  className="h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.99] dark:hover:bg-transparent"
                >
                  <div className="peer relative aspect-square w-32 overflow-hidden rounded hover:ring-2 hover:ring-slate-500">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 h-full w-full bg-neutral-950/60" />
                    <Icons.edit
                      // at the center of the image
                      className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-slate-100"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-sm text-slate-400 peer-hover:text-slate-50 sm:text-base">
                    {profile.name}
                  </h2>
                </Button>
              )
          )}
        </div>
        <Button
          aria-label="Done editing profiles"
          className="h-auto w-fit rounded-none py-1.5"
          onClick={() => void router.push("/")}
        >
          Done
        </Button>
      </div>
    </div>
  )
}

export default Profiles
