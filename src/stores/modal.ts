import type { Show } from "@/types"
import { create } from "zustand"

interface ModalState {
  open: boolean
  setOpen: (open: boolean) => void
  show: Show | null
  setShow: (show: Show | null) => void
  play: boolean
  setPlay: (play: boolean) => void
}

export const useModalStore = create<ModalState>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
  show: null,
  setShow: (show: Show | null) => set(() => ({ show })),
  play: false,
  setPlay: (play: boolean) => set(() => ({ play })),
}))
