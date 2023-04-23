import type { ProfileWithIcon } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type ProfileState = {
  profile: ProfileWithIcon | null
  setProfile: (profile: ProfileWithIcon) => void
  profiles: ProfileWithIcon[] | null
  setProfiles: (profiles: ProfileWithIcon[]) => void
  otherProfiles: ProfileWithIcon[] | null
  setOtherProfiles: (
    profile: ProfileWithIcon,
    profiles: ProfileWithIcon[]
  ) => void
}

export const useProfileStore = create<ProfileState>()(
  devtools((set) => ({
    profile: null,
    setProfile: (profile: ProfileWithIcon) => set({ profile }),
    profiles: null,
    setProfiles: (profiles: ProfileWithIcon[]) => set({ profiles }),
    otherProfiles: null,
    setOtherProfiles: (profile: ProfileWithIcon, profiles: ProfileWithIcon[]) =>
      set({ otherProfiles: profiles.filter((p) => p.id !== profile.id) }),
  }))
)

// export const useProfileStore = create<ProfileState>()(
//   devtools(
//     persist(
//       (set) => ({
//         profile: null,
//         setProfile: (profile: ProfileWithIcon) => set({ profile }),
//         profiles: null,
//         setProfiles: (profiles: ProfileWithIcon[]) => set({ profiles }),
//         otherProfiles: null,
//         setOtherProfiles: (
//           profile: ProfileWithIcon,
//           profiles: ProfileWithIcon[]
//         ) =>
//           set({ otherProfiles: profiles.filter((p) => p.id !== profile.id) }),
//       }),
//       {
//         name: "profile-store",
//         storage: createJSONStorage(() => sessionStorage),
//       }
//     )
//   )
// )
