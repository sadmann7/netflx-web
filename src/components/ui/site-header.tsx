"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/ui/main-nav"

const SiteHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  const changeBgColor = () => {
    window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false)
  }
  useEffect(() => {
    window.addEventListener("scroll", changeBgColor)
    return () => window.removeEventListener("scroll", changeBgColor)
  }, [isScrolled])

  return (
    <header
      aria-label="Header"
      className={cn(
        "sticky top-0 z-40 w-full",
        isScrolled ? "bg-white dark:bg-neutral-950" : "bg-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center space-x-5">
          <Icons.search className="aspect-square w-5 cursor-pointer text-white transition-opacity hover:opacity-75 active:opacity-100" />
          <Icons.bell className="aspect-square w-5 cursor-pointer text-white transition-opacity hover:opacity-75 active:opacity-100" />
          <Image
            src="/images/who-is-watching.webp"
            alt="who is watching"
            width={755}
            height={736}
            className="h-auto w-7 cursor-pointer rounded-sm transition-opacity hover:opacity-75 active:opacity-100"
            loading="lazy"
          />
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader
