"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { NavItem } from "@/types"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

const navItems = [
  { title: "Home", href: "/" },
  { title: "TV Shows", href: "/tv-shows" },
  { title: "Movies", href: "/movies" },
  { title: "New & Popular", href: "/new-and-popular" },
  { title: "My List", href: "/my-list" },
] satisfies NavItem[]

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
      aria-label="header"
      className={cn(
        "sticky top-0 z-40 w-full py-4 text-white transition-all md:py-6",
        isScrolled ? "bg-zinc-900" : "bg-transparent"
      )}
    >
      <nav className="container flex w-full max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <Image
              src="/images/netflix-logo.svg"
              alt="netflix"
              width={1024}
              height={276.74}
              className="h-auto w-28 object-cover transition-opacity hover:opacity-75 active:opacity-100"
              priority
            />
          </Link>
          <ul className="hidden items-center justify-between gap-5 md:flex">
            {navItems.map((item) => (
              <li
                key={item.title}
                className="text-sm transition-opacity hover:opacity-75 active:opacity-100 md:text-base"
              >
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
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
