import type { Show } from "@/types"
import { create } from "zustand"

interface SearchState {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  query: string
  setQuery: (query: string) => void
  shows: Show[]
  setShows: (shows: Show[]) => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  query: "",
  setQuery: (query: string) => set(() => ({ query })),
  shows: [],
  setShows: (shows: Show[]) => set(() => ({ shows })),
}))
