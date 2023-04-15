import type { Show } from "@/types"
import { create } from "zustand"

interface ModalState {
  isModalOpen: boolean
  toggleModal: () => void
  show: Show | null
  setShow: (show: Show | null) => void
  shouldPlay: boolean
  setShouldPlay: (shouldPlay: boolean) => void
}

export const useModalStore = create<ModalState>()((set) => ({
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  show: null,
  setShow: (show: Show | null) => set(() => ({ show })),
  shouldPlay: false,
  setShouldPlay: (shouldPlay: boolean) => set(() => ({ shouldPlay })),
}))
