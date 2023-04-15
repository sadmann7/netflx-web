import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import Login from "@/components/login"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse TV Shows",
}

export default function TVShowsPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <Login />
    </div>
  )
}
