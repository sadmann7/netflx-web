import Image from "next/image";
import { useEffect, useState } from "react";

// imports: icons, types, stores
import { useMovieStore } from "@/stores/movie";
import { Movie } from "@/types/types";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useModalStore } from "@/stores/modal";

type HeroProps = {
  movies: Movie[];
};

const Hero = ({ movies }: HeroProps) => {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * movies.length);
    setRandomMovie(movies[randomNumber]);
  }, [movies]);

  const movieStore = useMovieStore((state) => state);
  const modalStore = useModalStore((state) => state);

  const openModal = (movie: Movie) => {
    movieStore.setMovie(movie);
    modalStore.toggleModal();
  };

  return (
    <section aria-label="hero section" className="w-full pt-10 pb-24 ">
      {randomMovie && (
        <div className="w-[89vw] max-w-screen-2xl mx-auto">
          <div className="absolute inset-0 -z-10 w-full h-screen">
            <div className="z-10 absolute inset-0 w-full h-full bg-black/75 bg-gradient-body from-gray-900/10 to-[#010511]" />
            <Image
              src={`https://image.tmdb.org/t/p/original/${
                randomMovie?.poster_path || randomMovie?.backdrop_path
              }`}
              alt={randomMovie?.title ?? "poster"}
              className="object-cover"
              fill
              priority
            />
          </div>
          <div className="pt-24 max-w-lg grid space-y-2 ">
            <h1 className="text-3xl md:text-4xl font-bold">
              {randomMovie?.title ?? randomMovie?.name}
            </h1>
            <div className="flex space-x-2 text-xs md:text-sm font-semibold">
              <p className="text-green-600">
                {randomMovie?.vote_average * 10 ?? "-"}% Match
              </p>
              <p className="text-gray-300">
                {randomMovie?.release_date ?? "-"}
              </p>
            </div>
            <p className="text-gray-300 text-sm md:text-base line-clamp-4">
              {randomMovie?.overview ?? "-"}
            </p>
            <div className="pt-1.5 flex items-center space-x-2">
              <button
                aria-label="play video"
                className="px-3 py-1 bg-white rounded-sm flex items-center space-x-1.5 text-black text-sm md:text-base font-bold whitespace-nowrap hover:opacity-75 active:opacity-100 transition-opacity"
              >
                <PlayIcon className="w-4 aspect-square" />
                <p>Play</p>
              </button>
              <button
                aria-label="open modal"
                className="px-3 py-1 bg-gray-400/40 rounded-sm flex items-center space-x-1.5 text-white text-sm md:text-base font-medium whitespace-nowrap hover:opacity-75 active:opacity-100 transition-opacity"
                onClick={() => openModal(randomMovie)}
              >
                <InformationCircleIcon className="w-4 aspect-square" />
                <p>More Info</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
