import type { PickedProfile } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type ProfileState = {
  profile: PickedProfile | null
  setProfile: (profile: PickedProfile) => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        setProfile: (profile: PickedProfile) => set({ profile }),
      }),
      {
        name: "profile-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
)
