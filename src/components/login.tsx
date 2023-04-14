"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "react-hot-toast"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)

  const googleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google")
      toast.success("Successfully logged in")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      aria-label="Login with Discord"
      className="w-full"
      onClick={isLoading ? undefined : googleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" aria-hidden="true" />
      )}
      Google
    </Button>
  )
}

export default Login
