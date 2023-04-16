import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import LoginButton from "@/components/login-button"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="container flex min-h-screen w-full max-w-xl flex-col items-center justify-center">
      <div className="w-full rounded-md bg-zinc-800/25 p-14 backdrop-blur-lg">
        <h1 className="mb-4 text-center text-3xl font-bold">Sign in</h1>
        <LoginButton />
      </div>
    </div>
  )
}
