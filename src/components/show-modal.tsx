"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { env } from "@/env.mjs"
import { useModalStore } from "@/stores/modal"
import { useProfileStore } from "@/stores/profile"
import type { Genre, ShowWithGenreAndVideo } from "@/types"
import { useIsMutating } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import ReactPlayer from "react-player/lazy"

import { api } from "@/lib/api/api"
import { cn, getYear } from "@/lib/utils"
import DynamicTooltip from "@/components/dynamic-tooltip"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

interface ShowModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const ShowModal = ({ open, setOpen }: ShowModalProps) => {
  const router = useRouter()
  const apiUtils = api.useContext()

  // stores
  const modalStore = useModalStore()
  const profileStore = useProfileStore()

  const [trailer, setTrailer] = React.useState("")
  const [genres, setGenres] = React.useState<Genre[]>([])
  const [isMuted, setIsMuted] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)

  // get trailer and genres of show
  React.useEffect(() => {
    const getShow = async () => {
      if (!modalStore.show) return

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${
            modalStore.show?.media_type === "tv" ? "tv" : "movie"
          }/${modalStore.show?.id}?api_key=${
            env.NEXT_PUBLIC_TMDB_API_KEY
          }&language=en-US&append_to_response=videos`
        )
        const data = (await response.json()) as ShowWithGenreAndVideo
        if (data?.videos) {
          const trailerIndex = data.videos.results.findIndex(
            (item) => item.type === "Trailer"
          )
          setTrailer(data.videos?.results[trailerIndex]?.key ?? "")
        }
        if (data?.genres) {
          setGenres(data.genres)
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        )
      }
    }
    void getShow()
  }, [modalStore.show])

  React.useEffect(() => {
    if (modalStore.play) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [modalStore.play])

  React.useEffect(() => {
    if (isPlaying) {
      setIsMuted(false)
    } else {
      setIsMuted(true)
    }
  }, [isPlaying])

  // user query
  const userQuery = api.user.getCurrent.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // my shows query
  const myShowsQuery = profileStore.profile
    ? api.myList.getAll.useQuery(profileStore.profile.id, {
        enabled: !!userQuery.data,
      })
    : null

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
    void apiUtils.myList.getAll.invalidate()
  }, [apiUtils, mutationCount])

  return (
    <Dialog
      aria-label="Modal containing show's details"
      onOpenChange={() => {
        setOpen(!open)
        modalStore.setShow(null)
      }}
      open={open}
    >
      <DialogContent className="w-full overflow-hidden rounded-md bg-zinc-900 p-0 text-left align-middle shadow-xl dark:bg-zinc-900 sm:max-w-3xl">
        <div className="relative aspect-video">
          <div
            className={cn(
              "bg-black/10 bg-gradient-to-b from-neutral-900/10 to-neutral-900",
              "absolute inset-0 z-10 h-full w-full"
            )}
          />
          <ReactPlayer
            style={{ position: "absolute", top: 0, left: 0 }}
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            muted={isMuted}
            playing={isPlaying}
            controls={false}
            onStart={() => setIsPlaying(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="absolute bottom-6 z-20 flex w-full items-center justify-between gap-2 px-10">
            <div className="flex items-center gap-2.5">
              <Button
                aria-label={`${isPlaying ? "Pause" : "Play"} show`}
                className="group h-auto rounded py-1.5"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Icons.pause
                      className="mr-1.5 h-6 w-6 fill-current"
                      aria-hidden="true"
                    />
                    Pause
                  </>
                ) : (
                  <>
                    <Icons.play
                      className="mr-1.5 h-6 w-6 fill-current"
                      aria-hidden="true"
                    />
                    Play
                  </>
                )}
              </Button>
              <DynamicTooltip
                text={isAdded ? "Remove from My List" : "Add to My List"}
              >
                <Button
                  aria-label={
                    isAdded ? "Remove from My List" : "Add to My List"
                  }
                  variant="ghost"
                  className="h-auto rounded-full bg-neutral-800 p-1.5 ring-1 ring-slate-400 hover:bg-neutral-800 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                  onClick={() => {
                    !userQuery.data && router.push("/login")

                    if (!modalStore.show || !profileStore.profile) return

                    isAdded ||
                    myShowsQuery?.data?.find(
                      (item) => item.id === modalStore.show?.id
                    )
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
                        })
                  }}
                  disabled={
                    !userQuery.data ||
                    !modalStore.show ||
                    !profileStore.profile ||
                    mutationCount > 0
                  }
                >
                  {isAdded ||
                  myShowsQuery?.data?.find(
                    (item) => item.id === modalStore.show?.id
                  ) ? (
                    <Icons.check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Icons.add className="h-5 w-5" aria-hidden="true" />
                  )}
                </Button>
              </DynamicTooltip>
            </div>
            <Button
              aria-label={`${isMuted ? "Unmute" : "Mute"} video`}
              variant="ghost"
              className="h-auto rounded-full bg-neutral-800 p-1.5 opacity-50 ring-1 ring-slate-400 hover:bg-neutral-800 hover:opacity-100 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <Icons.volumneMute className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Icons.volumne className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-2.5 px-10 pb-10">
          <DialogTitle className="text-lg font-medium leading-6 text-slate-50 sm:text-xl">
            {modalStore.show?.title ?? modalStore.show?.name}
          </DialogTitle>
          <div className="flex items-center space-x-2 text-sm sm:text-base">
            <p className="font-semibold text-green-400">
              {Math.round((Number(modalStore.show?.vote_average) / 10) * 100) ??
                "-"}
              % Match
            </p>
            {modalStore.show?.release_date ? (
              <p>{getYear(modalStore.show?.release_date)}</p>
            ) : modalStore.show?.first_air_date ? (
              <p>{getYear(modalStore.show?.first_air_date)}</p>
            ) : null}
            {modalStore.show?.original_language && (
              <span className="grid h-4 w-7 place-items-center text-xs font-bold text-neutral-400 ring-1 ring-neutral-400">
                {modalStore.show.original_language.toUpperCase()}
              </span>
            )}
          </div>
          <DialogDescription className="line-clamp-3 text-xs text-slate-50 dark:text-slate-50 sm:text-sm">
            {modalStore.show?.overview ?? "-"}
          </DialogDescription>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-400">Genres:</span>
            {genres.map((genre) => genre.name).join(", ")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowModal
