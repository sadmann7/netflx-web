import type { Movie } from "@/types"
import { create } from "zustand"

interface ModalState {
  isModalOpen: boolean
  toggleModal: () => void
  movie: Movie | null
  setMovie: (movie: Movie | null) => void
  shouldPlay: boolean
  setShouldPlay: (shouldPlay: boolean) => void
}

export const useModalStore = create<ModalState>()((set) => ({
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  movie: null,
  setMovie: (movie: Movie | null) => set(() => ({ movie })),
  shouldPlay: false,
  setShouldPlay: (shouldPlay: boolean) => set(() => ({ shouldPlay })),
}))
