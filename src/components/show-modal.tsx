"use client"

import { useEffect, useState } from "react"
import { env } from "@/env.mjs"
import { useModalStore } from "@/stores/modal"
import { useMyListStore } from "@/stores/my-list"
import type { Genre, Show } from "@/types"
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
  // stores
  const modalStore = useModalStore()
  const myListStore = useMyListStore()

  const [trailer, setTrailer] = useState("")
  const [genres, setGenres] = useState<Genre[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // get trailer and genres of show
  useEffect(() => {
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
        const data = (await response.json()) as Show
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

  useEffect(() => {
    if (modalStore.play) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [modalStore.play])

  useEffect(() => {
    if (isPlaying) {
      setIsMuted(false)
    } else {
      setIsMuted(true)
    }
  }, [isPlaying])

  // add show mutation
  const addShowMutation = api.myList.create.useMutation({
    onSuccess: () => {
      toast.success("Added to My List")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Dialog
      aria-label="Modal containing show's details"
      onOpenChange={() => {
        setOpen(!open)
        modalStore.setShow(null)
      }}
      open={open}
    >
      <DialogContent className="w-full overflow-hidden rounded-md p-0 text-left align-middle shadow-xl dark:bg-zinc-900 sm:max-w-3xl">
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
              {myListStore.shows.some((s) => s.id === modalStore.show?.id) ? (
                <DynamicTooltip text="Remove from My List">
                  <Button
                    aria-label="Remove show from my list"
                    variant="ghost"
                    className="h-auto rounded-full bg-neutral-400 p-1.5 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                    onClick={() => {
                      modalStore.show
                        ? myListStore.removeShow(modalStore.show)
                        : null
                      toast.success("Removed from My List")
                    }}
                  >
                    <Icons.check className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </DynamicTooltip>
              ) : (
                <DynamicTooltip text="Add to My List">
                  <Button
                    aria-label="Add show to my list"
                    variant="ghost"
                    className="h-auto rounded-full bg-neutral-400 p-1.5 ring-1 ring-slate-400 hover:bg-neutral-400 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
                    onClick={() => {
                      // modalStore.show
                      //   ? myListStore.addShow(modalStore.show)
                      //   : null
                      // toast.success("Added to My List")

                      modalStore.show
                        ? addShowMutation.mutate({
                            profileId: "clgq7526x0000u400kdxq3rvx",
                            tmdbId: modalStore.show.id,
                            name: modalStore.show.name ?? modalStore.show.title,
                            poster:
                              modalStore.show.poster_path ??
                              modalStore.show.backdrop_path ??
                              "",
                            mediaType: modalStore.show.media_type,
                          })
                        : null
                    }}
                  >
                    <Icons.add className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </DynamicTooltip>
              )}
            </div>
            <Button
              aria-label={`${isMuted ? "Unmute" : "Mute"} video`}
              variant="ghost"
              className="h-auto rounded-full bg-neutral-400 p-1.5 opacity-50 ring-1 ring-slate-400 hover:bg-neutral-400 hover:opacity-100 hover:ring-white focus:ring-offset-0 dark:bg-neutral-800 dark:hover:bg-neutral-800"
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
          <DialogDescription className="line-clamp-3 text-xs text-slate-700 dark:text-slate-50 sm:text-sm">
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
