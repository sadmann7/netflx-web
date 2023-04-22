"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import type { PickedProfile } from "@/types"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface WatchingProfilesProps {
  profiles: PickedProfile[]
}

const WatchingProfiles = ({ profiles }: WatchingProfilesProps) => {
  const router = useRouter()

  return (
    <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-medium sm:text-4xl">{`Who's`} watching?</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {profiles.map((profile) => (
          <Button
            aria-label="Navigate to edit profile page"
            key={profile.id}
            variant="ghost"
            className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.98] dark:hover:bg-transparent"
            onClick={() => {
              console.log(profile)
            }}
          >
            <div className="relative aspect-square h-24 w-fit overflow-hidden rounded shadow-sm group-hover:ring-4 group-hover:ring-slate-50 sm:h-28 md:h-32">
              {profile.icon ? (
                <Image
                  src={profile.icon.href}
                  alt={profile.icon.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <Skeleton className="h-full w-full bg-neutral-700" />
              )}
            </div>
            <h2 className="text-sm text-slate-400 group-hover:text-slate-50 sm:text-base">
              {profile.name}
            </h2>
          </Button>
        ))}
      </div>
      <Button
        aria-label="Navigate to manage profiles page"
        variant="outline"
        size="auto"
        className="rounded-none"
        onClick={() => void router.push("/profiles")}
      >
        Manage Profiles
      </Button>
    </div>
  )
}

export default WatchingProfiles
