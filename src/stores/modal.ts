import { Movie } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type ModalState = {
  isOpen: boolean;
  toggleModal: () => void;
};

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));
