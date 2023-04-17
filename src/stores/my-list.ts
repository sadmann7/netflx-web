import type { Show } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type MyListState = {
  shows: Show[]
  addShow: (show: Show) => void
  removeShow: (show: Show) => void
}

export const useMyListStore = create<MyListState>()(
  devtools(
    persist(
      (set) => ({
        shows: [],
        addShow: (show: Show) =>
          set((state) => ({
            shows: state.shows.some((s) => s.id === show.id)
              ? state.shows
              : [...state.shows, show],
          })),
        removeShow: (show: Show) =>
          set((state) => ({
            shows: state.shows.filter((s) => s.id !== show.id),
          })),
      }),
      {
        name: "show-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
)
