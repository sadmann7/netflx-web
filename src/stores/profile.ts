import type { PickedProfile } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type ProfileState = {
  profileId: string | null
  setProfileId: (profileId: string) => void
  profile: PickedProfile | null
  setProfile: (profile: PickedProfile) => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        profileId: null,
        setProfileId: (profileId: string) => set({ profileId }),
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
