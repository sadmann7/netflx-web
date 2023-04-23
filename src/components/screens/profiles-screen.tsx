"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks/use-mounted"
import { useProfileStore } from "@/stores/profile"

import { api } from "@/lib/api/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const ProfilesScreen = () => {
  const router = useRouter()

  // profiles query
  const profilesQuery = api.profile.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // profile store
  const profileStore = useProfileStore()

  // check if component is mounted
  const mounted = useMounted()

  if (!mounted || profilesQuery.isLoading) {
    return (
      <div className="container flex min-h-screen w-full max-w-5xl items-center justify-center">
        <div className="flex  flex-wrap items-center justify-center gap-2 sm:gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton
              key={i}
              className="aspect-square h-24 rounded bg-neutral-700 sm:h-28 md:h-32"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center space-y-8">
      <h1 className="text-center text-3xl font-medium sm:text-4xl">
        {`Who's`} watching?
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {profilesQuery.isSuccess &&
          profilesQuery.data.map((profile) => (
            <Button
              aria-label="Select profile"
              key={profile.id}
              variant="ghost"
              className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.98] dark:hover:bg-transparent"
              onClick={() => profileStore.setProfileId(profile.id)}
            >
              <div className="relative aspect-square h-24 w-fit overflow-hidden rounded shadow-sm group-hover:ring-2 group-hover:ring-slate-50 sm:h-28 md:h-32">
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

export default ProfilesScreen
