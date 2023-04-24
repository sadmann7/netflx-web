"use client"

import { useMounted } from "@/hooks/use-mounted"
import { useProfileStore } from "@/stores/profile"
import { useSearchStore } from "@/stores/search"
import type { SessionUser } from "@/types"

import { api } from "@/lib/api/api"
import ShowsGrid from "@/components/shows-grid"
import ShowSkeleton from "@/components/shows-skeleton"

interface MyShowsProps {
  user?: SessionUser
}

const MyShows = ({ user }: MyShowsProps) => {
  const mounted = useMounted()

  // stores
  const searchStore = useSearchStore()
  const profileStore = useProfileStore()

  // my shows query
  const myShowsQuery = profileStore.profile
    ? api.myList.getAll.useQuery(profileStore.profile.id, {
        enabled: !!user,
      })
    : null

  if (!mounted) {
    return <ShowSkeleton variant="without-title" />
  }

  if (myShowsQuery?.data?.length === 0) {
    return (
      <div className="container flex w-full max-w-screen-2xl flex-col gap-2.5">
        <h1 className="text-2xl font-bold sm:text-3xl">Your list is empty</h1>
        <p className="text-slate-400 dark:text-slate-400">
          Add shows and movies to your list to watch them later
        </p>
      </div>
    )
  }

  if (searchStore.query.length > 0) {
    return <ShowsGrid shows={searchStore.shows} />
  }

  return (
    <ShowsGrid
      shows={user && myShowsQuery?.isSuccess ? myShowsQuery.data : []}
    />
  )
}

export default MyShows
