import type { PickedShow } from "@/types"
import { create } from "zustand"

interface ModalState {
  open: boolean
  setOpen: (open: boolean) => void
  show: PickedShow | null
  setShow: (show: PickedShow | null) => void
  play: boolean
  setPlay: (play: boolean) => void
}

export const useModalStore = create<ModalState>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
  show: null,
  setShow: (show: PickedShow | null) => set(() => ({ show })),
  play: false,
  setPlay: (play: boolean) => set(() => ({ play })),
}))
