import Image from "next/image";
import { useRef, useState } from "react";

// external imports
import { useModalStore } from "@/stores/modal";
import { Movie } from "@/types/globals";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type RowProps = {
  title: string;
  movies: Movie[];
};

const Row = ({ title, movies }: RowProps) => {
  const moviesRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const scrollToPoint = (direction: "left" | "right") => {
    if (!moviesRef.current) return;

    setIsScrollable(true);
    const { scrollLeft, clientWidth } = moviesRef.current;
    const offset =
      direction === "left"
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
    moviesRef.current.scrollTo({ left: offset, behavior: "smooth" });
  };

  const modalStore = useModalStore((state) => state);

  return (
    <section aria-label="horizontally-scrollable row">
      {movies.length !== 0 && (
        <div className="space-y-2.5 w-[89vw] max-w-screen-2xl mx-auto">
          <h2 className="text-white/90 hover:text-white transition-colors text-base md:text-xl font-semibold ">
            {title ?? "-"}
          </h2>
          <div className="group relative">
            <ChevronLeftIcon
              aria-label="scroll to right"
              className={`${
                isScrollable ? "block" : "hidden"
              } z-10 w-8 aspect-square text-white absolute top-1/3 left-2 cursor-pointer opacity-0 hover:scale-110 active:scale-90 group-hover:opacity-100 transition-all`}
              onClick={() => scrollToPoint("left")}
            />
            <div
              ref={moviesRef}
              className="overflow-x-scroll scrollbar-thin flex space-x-2"
            >
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative w-full min-w-[15rem] h-28 aspect-square rounded-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => {
                    modalStore.setMovie(movie);
                    modalStore.toggleModal();
                    modalStore.setShouldPlay(false);
                  }}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${
                      movie.backdrop_path ?? movie.poster_path
                    }`}
                    alt={movie.title ?? "poster"}
                    fill
                    sizes="(max-width: 768px) 100vw, 
                    (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <ChevronRightIcon
              aria-label="scroll to left"
              className="z-10 w-8 aspect-square text-white absolute top-1/3 right-2 cursor-pointer opacity-0 hover:scale-110 active:scale-90 group-hover:opacity-100 transition-all"
              onClick={() => scrollToPoint("right")}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Row;
