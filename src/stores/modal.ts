import { Movie } from "@/types/globals";
import { create } from "zustand";

type ModalState = {
  isModalOpen: boolean;
  toggleModal: () => void;
  movie: null | Movie;
  setMovie: (currentMovie: Movie | null) => void;
  shouldPlay: boolean;
  setShouldPlay: (shouldPlay: boolean) => void;
};

export const useModalStore = create<ModalState>()((set) => ({
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  movie: null,
  setMovie: (currentMovie: Movie | null) =>
    set((state) => ({ movie: currentMovie })),
  shouldPlay: false,
  setShouldPlay: (shouldPlay: boolean) => set((state) => ({ shouldPlay })),
}));
