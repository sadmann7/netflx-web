import type { ProfileWithIcon } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type ProfileState = {
  profile: ProfileWithIcon | null
  setProfile: (profile: ProfileWithIcon) => void
  pinForm: boolean
  setPinForm: (pinForm: boolean) => void
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        setProfile: (profile: ProfileWithIcon) => set({ profile }),
        pinForm: false,
        setPinForm: (pinForm: boolean) => set({ pinForm }),
      }),
      {
        name: "test-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
)
