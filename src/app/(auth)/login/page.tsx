import type { Metadata } from "next"

import Login from "@/components/login"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-full max-w-xl flex-col items-center justify-center">
      <div className="w-full rounded-md bg-zinc-800/25 p-14 backdrop-blur-lg">
        <h1 className="mb-4 text-center text-3xl font-bold">Sign in</h1>
        <Login />
      </div>
    </div>
  )
}
