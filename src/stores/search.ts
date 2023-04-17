import type { Show } from "@/types"
import { create } from "zustand"

interface SearchState {
  query: string
  setQuery: (query: string) => void
  shows: Show[]
  setShows: (shows: Show[]) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: "",
  setQuery: (query: string) => set(() => ({ query })),
  shows: [],
  setShows: (shows: Show[]) => set(() => ({ shows })),
}))
