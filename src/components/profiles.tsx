"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Profile } from "@prisma/client"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ProfilesProps {
  profiles: Profile[]
}

const Profiles = ({ profiles }: ProfilesProps) => {
  const router = useRouter()

  return (
    <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-medium sm:text-4xl">Manage Profiles:</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {profiles.map(
          (profile) =>
            profile.image && (
              <Button
                aria-label="Navigate to edit profile page"
                key={profile.id}
                variant="ghost"
                className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.99] dark:hover:bg-transparent"
                onClick={() => router.push(`/profiles/${profile.id}`)}
              >
                <div className="relative aspect-square w-32 overflow-hidden rounded group-hover:ring-2 group-hover:ring-slate-500">
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 h-full w-full bg-neutral-800/25" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Icons.edit
                      className="h-8 w-8 text-slate-100"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h2 className="text-sm text-slate-400 group-hover:text-slate-50 sm:text-base">
                  {profile.name}
                </h2>
              </Button>
            )
        )}
        {profiles.length < 5 && (
          <Button
            aria-label="Navigate to add profile page"
            variant="ghost"
            className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.99] dark:hover:bg-transparent"
            onClick={() => router.push("/profiles/add")}
          >
            <div className="relative aspect-square w-32 overflow-hidden rounded bg-neutral-800/50 group-hover:ring-2 group-hover:ring-slate-500">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 ring-2 ring-slate-50">
                <Icons.add
                  className="h-8 w-8 text-slate-100"
                  aria-hidden="true"
                />
              </div>
            </div>
            <h2 className="text-sm text-slate-400 group-hover:text-slate-50 sm:text-base">
              Add Profile
            </h2>
          </Button>
        )}
      </div>
      <Button
        aria-label="Navigate to home page"
        variant="flat"
        size="auto"
        onClick={() => void router.push("/")}
      >
        Done
      </Button>
    </div>
  )
}

export default Profiles
