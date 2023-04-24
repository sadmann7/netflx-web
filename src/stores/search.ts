import type { PickedShow } from "@/types"
import { create } from "zustand"

interface SearchState {
  query: string
  setQuery: (query: string) => void
  shows: PickedShow[]
  setShows: (shows: PickedShow[]) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: "",
  setQuery: (query: string) => set(() => ({ query })),
  shows: [],
  setShows: (shows: PickedShow[]) => set(() => ({ shows })),
}))
