import { Movie } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type MovieState = {
  movie: null | Movie;
  setMovie: (currentMovie: Movie | null) => void;
};

export const useMovieStore = create<MovieState>()(
  devtools(
    persist(
      (set) => ({
        movie: null,
        setMovie: (currentMovie: Movie | null) =>
          set((state) => ({ movie: currentMovie })),
      }),
      {
        name: "movie",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
