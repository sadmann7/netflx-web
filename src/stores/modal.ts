import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  toggleModal: () => void;
};

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));
