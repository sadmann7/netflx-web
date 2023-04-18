"use client"

import { useEffect, useState } from "react"
import { env } from "@/env.mjs"
import { useModalStore } from "@/stores/modal"
import { useMyListStore } from "@/stores/my-list"
import type { Genre, Show } from "@/types"
import { toast } from "react-hot-toast"
import ReactPlayer from "react-player/lazy"

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

  return (
    <Dialog
      aria-label="Modal containing show's details"
      onOpenChange={() => {
        setOpen(!open)
        modalStore.setShow(null)
      }}
      open={open}
    >
      <DialogContent className="w-full overflow-hidden rounded-md p-0 text-left align-middle shadow-xl dark:bg-zinc-900 sm:max-w-2xl">
        <div className="relative aspect-video">
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
          <div className="absolute bottom-6 flex w-full items-center justify-between gap-2 px-6">
            <div className="flex items-center gap-2.5">
              <Button
                aria-label="control video playback"
                className="group h-auto gap-1 rounded-none px-3 py-1.5"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Icons.pause className="h-4 w-4" aria-hidden="true" />
                    Pause
                  </>
                ) : (
                  <>
                    <Icons.play className="h-4 w-4" aria-hidden="true" />
                    Play
                  </>
                )}
              </Button>
              {myListStore.shows.some((s) => s.id === modalStore.show?.id) ? (
                <Button
                  aria-label="remove show from my list"
                  variant="ghost"
                  className="h-auto rounded-full p-1 ring-1 ring-slate-100"
                  onClick={() => {
                    modalStore.show
                      ? myListStore.removeShow(modalStore.show)
                      : null
                    toast.success("Removed from My List")
                  }}
                >
                  <Icons.check className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  aria-label="add show to my list"
                  variant="ghost"
                  className="h-auto rounded-full p-1 ring-1 ring-slate-100"
                  onClick={() => {
                    modalStore.show
                      ? myListStore.addShow(modalStore.show)
                      : null
                    toast.success("Added to My List")
                  }}
                >
                  <Icons.add className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
            <Button
              aria-label="toggle sound"
              variant="ghost"
              className="h-auto rounded-full p-1.5 ring-1 ring-slate-50"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <Icons.volumneMute
                  className="h-4 w-4 text-slate-50"
                  aria-hidden="true"
                />
              ) : (
                <Icons.volumne
                  className="h-4 w-4 text-slate-50"
                  aria-hidden="true"
                />
              )}
            </Button>
          </div>
        </div>
        <div className="grid gap-2 px-5 pb-5">
          <DialogTitle className="text-lg font-medium leading-6 text-slate-50 md:text-xl">
            {modalStore.show?.title ?? modalStore.show?.name}
          </DialogTitle>
          <div className="flex items-center space-x-2 text-xs md:text-sm">
            <p className=" text-green-600">
              {Math.round((Number(modalStore.show?.vote_average) / 10) * 100) ??
                "-"}
              % Match
            </p>
            <p>{modalStore.show?.release_date ?? "-"}</p>
            <p>{modalStore.show?.original_language.toUpperCase() ?? "-"}</p>
          </div>
          <DialogDescription className="line-clamp-3 text-xs md:text-sm">
            {modalStore.show?.overview ?? "-"}
          </DialogDescription>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-400">Genres:</span>
            {genres.map((genre) => genre.name).join(", ")}
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-400">Total Votes:</span>
            {modalStore.show?.vote_count ?? "-"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShowModal
