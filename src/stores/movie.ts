import { Movie } from "@/types/globals";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type MovieState = {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (movie: Movie) => void;
};

export const useMovieStore = create<MovieState>()(
  devtools(
    persist(
      (set) => ({
        movies: [],
        addMovie: (movie: Movie) =>
          set((state) => ({
            movies: state.movies.some((m) => m.id === movie.id)
              ? state.movies
              : [...state.movies, movie],
          })),
        removeMovie: (movie: Movie) =>
          set((state) => ({
            movies: state.movies.filter((m) => m.id !== movie.id),
          })),
      }),
      {
        name: "movie",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
