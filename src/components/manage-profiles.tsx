"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import type { PickedProfile } from "@/types"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ManageProfilesProps {
  profiles: PickedProfile[]
}

const ManageProfiles = ({ profiles }: ManageProfilesProps) => {
  const router = useRouter()

  return (
    <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-medium sm:text-4xl">Manage Profiles:</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {profiles.map((profile) => (
          <Button
            aria-label="Navigate to edit profile page"
            key={profile.id}
            variant="ghost"
            className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.98] dark:hover:bg-transparent"
            onClick={() => router.push(`/profiles/${profile.id}`)}
          >
            <div className="relative aspect-square h-24 w-fit overflow-hidden rounded shadow-sm group-hover:ring-4 group-hover:ring-slate-500 sm:h-28 md:h-32">
              {profile.icon ? (
                <Image
                  src={profile.icon.href}
                  alt={profile.icon.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 
                    (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <Skeleton className="h-full w-full bg-neutral-700" />
              )}
              <div className="absolute inset-0 h-full w-full bg-neutral-800/50" />
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
        ))}
        {profiles.length < 5 && (
          <Button
            aria-label="Navigate to add profile page"
            variant="ghost"
            className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.99] dark:hover:bg-transparent"
            onClick={() => router.push("/profiles/add")}
          >
            <div className="relative aspect-square h-24 w-fit overflow-hidden rounded bg-neutral-800 group-hover:ring-4 group-hover:ring-slate-500 sm:h-28 md:h-32">
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

export default ManageProfiles
