"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks/use-mounted"
import { useProfileStore } from "@/stores/profile"
import type { Session } from "next-auth"

import { api } from "@/lib/api/api"
import SiteFooter from "@/components/layouts/site-footer"
import SiteHeader from "@/components/layouts/site-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfilesScreenProps {
  session: Session | null
  children: React.ReactNode
}

const ProfilesScreen = ({ session, children }: ProfilesScreenProps) => {
  const router = useRouter()
  const mounted = useMounted()

  // profiles query
  const profilesQuery = api.profile.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // profile store
  const profileStore = useProfileStore()

  if (session && !profileStore.profile) {
    return (
      <div className="container flex min-h-screen w-full max-w-5xl flex-col items-center justify-center space-y-8">
        <h1 className="text-center text-3xl font-medium sm:text-4xl">
          {`Who's`} watching?
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {!mounted || profilesQuery.isLoading
            ? Array.from({ length: 5 }, (_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-square h-24 rounded bg-neutral-700 sm:h-28 md:h-32"
                />
              ))
            : profilesQuery.isSuccess &&
              profilesQuery.data.map((profile) => (
                <Button
                  aria-label="Select profile"
                  key={profile.id}
                  variant="ghost"
                  className="group h-auto flex-col space-y-2 p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:scale-[0.98] dark:hover:bg-transparent"
                  onClick={() => {
                    profileStore.setProfile(profile)
                    profileStore.setProfiles(profilesQuery.data)
                    profileStore.setOtherProfiles(profile, profilesQuery.data)
                  }}
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
          disabled={profilesQuery.isLoading || profilesQuery.isError}
        >
          Manage Profiles
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader session={session} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

export default ProfilesScreen
