"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useModalStore } from "@/stores/modal"
import { useProfileStore } from "@/stores/profile"
import type { Show } from "@/types"
import { useIsMutating } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

import { api } from "@/lib/api/api"
import { cn } from "@/lib/utils"
import DynamicTooltip from "@/components/dynamic-tooltip"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface ShowsCarouselProps {
  title: string
  shows: Show[]
}

const ShowsCarousel = ({ title, shows }: ShowsCarouselProps) => {
  const showsRef = React.useRef<HTMLDivElement>(null)
  const [isScrollable, setIsScrollable] = React.useState(false)

  // handle scroll to left and right
  const scrollToDirection = (direction: "left" | "right") => {
    if (!showsRef.current) return

    setIsScrollable(true)
    const { scrollLeft, clientWidth } = showsRef.current
    const offset =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
    showsRef.current.scrollTo({ left: offset, behavior: "smooth" })

    if (scrollLeft === 0 && direction === "left") {
      showsRef.current.scrollTo({
        left: showsRef.current.scrollWidth,
        behavior: "smooth",
      })
    }
  }

  return (
    <section aria-label="Carousel of shows">
      {shows.length !== 0 && (
        <div className="container w-full max-w-screen-2xl space-y-1 sm:space-y-2.5">
          <h2 className="text-lg font-semibold text-white/90 transition-colors hover:text-white sm:text-xl">
            {title ?? "-"}
          </h2>
          <div className="group relative">
            {shows.length > 5 ? (
              <>
                <Button
                  aria-label="Scroll to right"
                  variant="ghost"
                  className={cn(
                    "absolute left-0 top-0 z-10 h-[8.5rem] rounded-none rounded-r bg-slate-950/50 px-2 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50",
                    isScrollable ? "block" : "hidden"
                  )}
                  onClick={() => scrollToDirection("left")}
                >
                  <Icons.chevronLeft
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  aria-label="Scroll to left"
                  variant="ghost"
                  className="absolute right-0 top-0 z-10 h-[8.5rem] rounded-none rounded-l bg-slate-950/50 px-2 py-0 opacity-0 hover:bg-slate-950/50 active:scale-100 group-hover:opacity-100 dark:hover:bg-slate-950/50"
                  onClick={() => scrollToDirection("right")}
                >
                  <Icons.chevronRight
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </Button>
              </>
            ) : null}
            <div
              ref={showsRef}
              className="no-scrollbar flex h-full w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden"
            >
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ShowsCarousel

const ShowCard = ({ show }: { show: Show }) => {
  const router = useRouter()
  const apiUtils = api.useContext()

  const [isHoverd, setIsHoverd] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)

  // stores
  const modalStore = useModalStore()
  const profileStore = useProfileStore()

  // user query
  const userQuery = api.user.getCurrent.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // add show mutation
  const addShowMutation = api.myList.create.useMutation({
    onSuccess: () => {
      setIsAdded(true)
      toast.success("Added to My List")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // remove show mutation
  const removeShowMuation = api.myList.delete.useMutation({
    onSuccess: () => {
      setIsAdded(false)
      toast.success("Removed from My List")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // refetch my shows query
  const mutationCount = useIsMutating()
  React.useEffect(() => {
    if (mutationCount > 0) {
      void apiUtils.myList.getAll.invalidate()
    }
  }, [apiUtils, mutationCount])

  return (
    <div
      className="relative aspect-video min-w-[15rem] cursor-pointer overflow-hidden rounded transition-all hover:z-20 hover:scale-125"
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      onClick={() => {
        modalStore.setShow(show)
        modalStore.setOpen(true)
        modalStore.setPlay(false)
      }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500/${
          show.backdrop_path ?? show.poster_path ?? ""
        }`}
        alt={show.title ?? "poster"}
        fill
        sizes="(max-width: 768px) 100vw, 
          (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        className={cn("h-auto w-full object-cover", isHoverd && "hidden")}
      />
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full bg-neutral-800 p-4",
          isHoverd ? "block" : "hidden"
        )}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500/${
            show.backdrop_path ?? show.poster_path ?? ""
          }`}
          alt={show.title ?? "poster"}
          fill
          sizes="(max-width: 768px) 100vw, 
            (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              aria-label="Play show"
              className="h-auto rounded-full p-1.5 hover:bg-white/80 focus:ring-offset-0 hover:dark:bg-white/80"
              onClick={() => {
                modalStore.setShow(show)
                modalStore.setOpen(true)
                modalStore.setPlay(true)
              }}
            >
              <Icons.play
                className="h-3 w-3 fill-current text-slate-950 dark:text-slate-950"
                aria-hidden="true"
              />
            </Button>
            <DynamicTooltip
              text={isAdded ? "Remove from My List" : "Add to My List"}
            >
              <Button
                aria-label={isAdded ? "Remove from My List" : "Add to My List"}
                variant="ghost"
                className="h-auto rounded-full bg-neutral-400 p-1.5 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                onClick={() => {
                  !userQuery.data && router.push("/login")

                  modalStore.show &&
                    profileStore.profile &&
                    (isAdded
                      ? removeShowMuation.mutate({
                          id: modalStore.show.id,
                          profileId: profileStore.profile.id,
                        })
                      : addShowMutation.mutate({
                          profileId: profileStore.profile.id,
                          id: modalStore.show.id,
                          name: modalStore.show.name ?? "",
                          title: modalStore.show.title ?? "",
                          original_title: modalStore.show.original_title ?? "",
                          poster_path: modalStore.show.poster_path ?? "",
                          backdrop_path: modalStore.show.backdrop_path ?? "",
                          overview: modalStore.show.overview ?? "",
                          original_language: modalStore.show.original_language,
                          media_type:
                            modalStore.show.media_type === "tv"
                              ? "tv"
                              : "movie",
                          popularity: modalStore.show.popularity,
                          vote_average: modalStore.show.vote_average,
                          vote_count: modalStore.show.vote_count,
                          release_date: modalStore.show.release_date ?? "",
                          first_air_date: modalStore.show.first_air_date ?? "",
                          adult: modalStore.show.adult,
                          video: modalStore.show.video,
                        }))
                }}
                disabled={
                  !userQuery.data ||
                  !modalStore.show ||
                  !profileStore.profile ||
                  mutationCount > 0
                }
              >
                {isAdded ? (
                  <Icons.check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Icons.add className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </DynamicTooltip>
          </div>
          <DynamicTooltip text="More Info">
            <Button
              aria-label="Show more info"
              variant="ghost"
              className="h-auto rounded-full bg-neutral-400 p-1 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              onClick={() => {
                modalStore.setShow(show)
                modalStore.setOpen(true)
                modalStore.setPlay(false)
              }}
            >
              <Icons.chevronDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DynamicTooltip>
        </div>
      </div>
    </div>
  )
}
