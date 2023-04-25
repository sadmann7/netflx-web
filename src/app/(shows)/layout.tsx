import { getSession } from "@/lib/session"
import ProfilesScreen from "@/components/screens/profiles-screen"

interface ShowsLayotutProps {
  children: React.ReactNode
}

export default async function ShowsLayout({ children }: ShowsLayotutProps) {
  const session = await getSession()

  // zustand state is not redable here
  // useProfileStore().getState().profile should return the profile
  // but it returns null
  // so sending the nested layout to the profiles screen
  // TODO: look for a way to use zustand profile state here

  return <ProfilesScreen session={session}>{children}</ProfilesScreen>
}
