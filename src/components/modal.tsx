"use client"

import { useEffect, useState } from "react"
import { env } from "@/env.mjs"
import { useModalStore } from "@/stores/modal"
import { useShowStore } from "@/stores/show"
import type { Genre, Show } from "@/types"
import { toast } from "react-hot-toast"
import ReactPlayer from "react-player/lazy"

import { Icons } from "@/components/icons"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ModalProps {
  isOpen: boolean
  toggleModal: () => void
}

const Modal = ({ isOpen, toggleModal }: ModalProps) => {
  // stores
  const modalStore = useModalStore()
  const showStore = useShowStore()

  const [trailer, setTrailer] = useState("")
  const [genres, setGenres] = useState<Genre[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // fetch show by id
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

        if (!response.ok) {
          toast.error("Show not found")
          return
        }

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
      onOpenChange={() => {
        toggleModal()
        modalStore.setShow(null)
      }}
      open={isOpen}
    >
      <DialogContent className="w-full max-w-2xl overflow-hidden rounded-md text-left align-middle shadow-xl dark:bg-zinc-900">
        <div className="relative aspect-video">
          <ReactPlayer
            style={{ position: "absolute", top: 0, left: 0 }}
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            muted={isMuted}
            playing={isPlaying}
          />
          <div className="absolute bottom-6 flex w-full items-center justify-between gap-2 px-6">
            <div className="flex items-center gap-2.5">
              <button
                aria-label="control video playback"
                className="flex items-center gap-1 rounded-sm bg-white px-2.5 py-1 text-sm text-black transition-opacity hover:opacity-90 active:opacity-100 md:text-base"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Icons.pause className="h-5 w-5" aria-hidden="true" />
                    <p>Pause</p>
                  </>
                ) : (
                  <>
                    <Icons.play className="h-5 w-5" aria-hidden="true" />
                    <p>Play</p>
                  </>
                )}
              </button>
              {showStore.shows.some((m) => m.id === modalStore.show?.id) ? (
                <button
                  aria-label="remove from my list"
                  className="grid aspect-square w-7 place-items-center rounded-full bg-gray-700 ring-1 ring-white transition-opacity hover:opacity-90 active:opacity-100"
                  onClick={() => {
                    modalStore.show
                      ? showStore.removeShow(modalStore.show)
                      : null
                    toast.success("Removed from My List")
                  }}
                >
                  <Icons.close
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <button
                  aria-label="add to my list"
                  className="grid aspect-square w-7 place-items-center rounded-full bg-gray-700 ring-1 ring-white transition-opacity hover:opacity-90 active:opacity-100"
                  onClick={() => {
                    modalStore.show ? showStore.addShow(modalStore.show) : null
                    toast.success("Added to My List")
                  }}
                >
                  <Icons.add
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </button>
              )}
              <button
                aria-label="thumb up"
                className="grid aspect-square w-7 place-items-center rounded-full bg-gray-700 ring-1 ring-white transition-opacity hover:opacity-90 active:opacity-100"
              >
                <Icons.thumbsUp
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </button>
            </div>
            <button
              aria-label="toggle audio"
              className="grid aspect-square w-7 place-items-center rounded-full bg-gray-700 ring-1 ring-white transition-opacity hover:opacity-90 active:opacity-100"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <Icons.volumneMute
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              ) : (
                <Icons.volumne
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
        <div className="grid gap-2">
          <DialogTitle className="text-lg font-medium leading-6 text-white md:text-xl">
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
          <p className="line-clamp-3 text-xs md:text-sm">
            {modalStore.show?.overview ?? "-"}
          </p>
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

export default Modal
