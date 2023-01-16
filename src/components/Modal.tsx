import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";

// imports: icons, types, stores
import { useModalStore } from "@/stores/modal";
import { useMovieStore } from "@/stores/movie";
import { Genre, MovieWithVideo } from "@/types/globals";
import { HandThumbUpIcon, MinusIcon } from "@heroicons/react/24/outline";
import {
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
};

const Modal = ({ isOpen, toggleModal }: ModalProps) => {
  const modalStore = useModalStore((state) => state);
  const movieStore = useMovieStore((state) => state);

  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const closeModal = () => {
    toggleModal();
    modalStore.setMovie(null);
  };

  useEffect(() => {
    if (!modalStore.movie) return;

    const getMovie = async () => {
      try {
        const data: MovieWithVideo = await fetch(
          `https://api.themoviedb.org/3/${
            modalStore.movie?.media_type === "tv" ? "tv" : "movie"
          }/${modalStore.movie?.id}?api_key=${
            process.env.NEXT_PUBLIC_TMDB_API_KEY
          }&language=en-US&append_to_response=videos`
        ).then((res) => res.json());

        if (data?.videos) {
          const trailerIndex = data.videos.results.findIndex(
            (item) => item.type === "Trailer"
          );
          setTrailer(data.videos?.results[trailerIndex]?.key);
        }
        if (data?.genres) {
          setGenres(data.genres);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getMovie();
  }, [modalStore.movie]);

  useEffect(() => {
    if (modalStore.shouldPlay) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [modalStore.shouldPlay]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-md bg-[#181818] text-left align-middle shadow-xl transition-all">
                <div className="relative aspect-video">
                  <button
                    type="button"
                    aria-label="close modal"
                    className="z-50 absolute top-4 right-4 flex items-center p-1 rounded-full bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:opacity-75 active:opacity-100 transition-opacity"
                    onClick={closeModal}
                  >
                    <XMarkIcon
                      aria-hidden="true"
                      className="w-4 aspect-square text-white"
                    />
                  </button>
                  <ReactPlayer
                    style={{ position: "absolute", top: 0, left: 0 }}
                    url={`https://www.youtube.com/watch?v=${trailer}`}
                    width="100%"
                    height="100%"
                    muted={isMuted}
                    playing={isPlaying}
                  />
                  <div className="absolute bottom-6 px-6 w-full flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        aria-label="control video playback"
                        className="text-black text-sm md:text-base bg-white rounded-sm px-2.5 py-1 flex items-center gap-1 hover:opacity-90 active:opacity-100 transition-opacity"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <>
                            <PauseIcon
                              aria-hidden="true"
                              className="w-5 aspect-square"
                            />
                            <p>Pause</p>
                          </>
                        ) : (
                          <>
                            <PlayIcon
                              aria-hidden="true"
                              className="w-5 aspect-square"
                            />
                            <p>Play</p>
                          </>
                        )}
                      </button>
                      {movieStore.movies.some(
                        (m) => m.id === modalStore.movie?.id
                      ) ? (
                        <button
                          aria-label="remove from my list"
                          className="bg-gray-700 rounded-full w-7 aspect-square grid place-items-center ring-1 ring-white hover:opacity-90 active:opacity-100 transition-opacity"
                          onClick={() => {
                            movieStore.removeMovie(modalStore.movie!);
                            toast.success("Removed from My List");
                          }}
                        >
                          <MinusIcon
                            aria-hidden="true"
                            className="w-5 aspect-square text-white"
                          />
                        </button>
                      ) : (
                        <button
                          aria-label="add to my list"
                          className="bg-gray-700 rounded-full w-7 aspect-square grid place-items-center ring-1 ring-white hover:opacity-90 active:opacity-100 transition-opacity"
                          onClick={() => {
                            movieStore.addMovie(modalStore.movie!);
                            toast.success("Added to My List");
                          }}
                        >
                          <PlusIcon
                            aria-hidden="true"
                            className="w-5 aspect-square text-white"
                          />
                        </button>
                      )}
                      <button
                        aria-label="thumb up"
                        className="bg-gray-700 rounded-full w-7 aspect-square grid place-items-center ring-1 ring-white hover:opacity-90 active:opacity-100 transition-opacity"
                      >
                        <HandThumbUpIcon
                          aria-hidden="true"
                          className="w-4 aspect-square text-white"
                        />
                      </button>
                    </div>
                    <button
                      aria-label="toggle audio"
                      className="bg-gray-700 rounded-full w-7 aspect-square grid place-items-center ring-1 ring-white hover:opacity-90 active:opacity-100 transition-opacity"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <SpeakerXMarkIcon
                          aria-hidden="true"
                          className="w-4 aspect-square text-white"
                        />
                      ) : (
                        <SpeakerWaveIcon
                          aria-hidden="true"
                          className="w-4 aspect-square text-white"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mx-6 my-7 grid gap-2">
                  <Dialog.Title
                    as="h1"
                    className="text-lg md:text-xl font-medium leading-6 text-white"
                  >
                    {modalStore.movie?.title ?? modalStore.movie?.name}
                  </Dialog.Title>
                  <div className="text-xs md:text-sm flex items-center space-x-2">
                    <p className=" text-green-600">
                      {Math.round(
                        (Number(modalStore.movie?.vote_average) / 10) * 100
                      ) ?? "-"}
                      % Match
                    </p>
                    <p>{modalStore.movie?.release_date ?? "-"}</p>
                    <p>
                      {modalStore.movie?.original_language.toUpperCase() ?? "-"}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm line-clamp-3">
                    {modalStore.movie?.overview ?? "-"}
                  </p>
                  <div className="text-xs md:text-sm flex items-center gap-2">
                    <span className="text-gray-400">Genres:</span>
                    {genres.map((genre) => genre.name).join(", ")}
                  </div>
                  <div className="text-xs md:text-sm flex items-center gap-2">
                    <span className="text-gray-400">Total Votes:</span>
                    {modalStore.movie?.vote_count ?? "-"}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
