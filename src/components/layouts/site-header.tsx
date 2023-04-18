"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchStore } from "@/stores/search"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { searchShows } from "@/lib/fetcher"
import { cn } from "@/lib/utils"
import ExpandableSearchbar from "@/components/expandable-searchbar"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/layouts/main-nav"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SiteHeaderProps {
  session: Session | null
}

const SiteHeader = ({ session }: SiteHeaderProps) => {
  const [isScrolled, setIsScrolled] = React.useState(false)

  // change background color on scroll
  const changeBgColor = () => {
    window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false)
  }
  React.useEffect(() => {
    window.addEventListener("scroll", changeBgColor)
    return () => window.removeEventListener("scroll", changeBgColor)
  }, [isScrolled])

  // search store
  const searchStore = useSearchStore()

  // search shows by query
  async function searchShowsByQuery(e: React.ChangeEvent<HTMLInputElement>) {
    searchStore.setQuery(e.target.value)
    const shows = await searchShows(searchStore.query)
    void searchStore.setShows(shows.results)
  }

  return (
    <header
      aria-label="Header"
      className={cn(
        "sticky top-0 z-40 w-full",
        isScrolled ? "bg-white dark:bg-neutral-950" : "bg-transparent"
      )}
    >
      <nav className="container flex h-16 max-w-screen-2xl items-center justify-between space-x-4 sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center space-x-5">
          <ExpandableSearchbar
            value={searchStore.query}
            onChange={(e) => void searchShowsByQuery(e)}
          />
          <Icons.bell className="h-5 w-5 cursor-pointer text-white transition-opacity hover:opacity-75 active:opacity-100" />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto px-2 py-1.5 text-base hover:bg-transparent focus:ring-0 hover:dark:bg-neutral-800 [&[data-state=open]>svg]:rotate-180"
                >
                  <Image
                    src="/images/who-is-watching.webp"
                    alt="who is watching"
                    width={755}
                    height={736}
                    className="h-auto w-7 cursor-pointer rounded-sm transition-opacity hover:opacity-75 active:opacity-100"
                    loading="lazy"
                  />
                  <Icons.chevronDown className="ml-2 h-4 w-4 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={20}
                className="w-52 overflow-y-auto overflow-x-hidden rounded-sm dark:bg-neutral-800/90 dark:text-slate-200"
              >
                {siteConfig.profileDropdownItems.map(
                  (item, index) =>
                    item.href &&
                    item !==
                      siteConfig.profileDropdownItems[
                        siteConfig.profileDropdownItems.length - 1
                      ] && (
                      <DropdownMenuItem
                        key={index}
                        asChild
                        className="dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      >
                        <Link href={item.href}>
                          {item.icon && (
                            <item.icon
                              className="mr-3 h-4 w-4"
                              aria-hidden="true"
                            />
                          )}
                          <span className="line-clamp-1">{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                )}
                <DropdownMenuSeparator />
                {siteConfig.profileDropdownItems.map(
                  (item, index) =>
                    item.href &&
                    item ===
                      siteConfig.profileDropdownItems[
                        siteConfig.profileDropdownItems.length - 1
                      ] && (
                      <DropdownMenuItem
                        key={index}
                        asChild
                        className="dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 "
                      >
                        <span
                          className="line-clamp-1 grid place-items-center"
                          onClick={() => void signOut()}
                        >
                          {item.title}
                        </span>
                      </DropdownMenuItem>
                    )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              aria-label="Sign in"
              className={cn(
                buttonVariants({
                  variant: "brand",
                  size: "sm",
                  className: "h-auto px-4 py-2",
                })
              )}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader
