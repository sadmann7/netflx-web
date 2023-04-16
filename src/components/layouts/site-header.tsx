"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { NavItem } from "@/types"
import type { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/layouts/main-nav"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dropdownItems = [
  {
    title: "Manage Profiles",
    href: "/manage-profiles",
    icon: Icons.edit,
  },
  {
    title: "Account",
    href: "/account",
    icon: Icons.user,
  },
  {
    title: "Help Center",
    href: "/help-center",
    icon: Icons.help,
  },
  {
    title: "Sign Out of Netflix",
    href: "/api/auth/signout",
  },
] satisfies NavItem[]

interface SiteHeaderProps {
  session: Session | null
}

const SiteHeader = ({ session }: SiteHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  console.log(session)

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
      <nav className="container flex h-16 max-w-screen-2xl items-center justify-between space-x-4 sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center space-x-5">
          <Icons.search className="aspect-square w-5 cursor-pointer text-white transition-opacity hover:opacity-75 active:opacity-100" />
          <Icons.bell className="aspect-square w-5 cursor-pointer text-white transition-opacity hover:opacity-75 active:opacity-100" />
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
                  <Icons.chevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={16}
                className="w-52 overflow-y-auto overflow-x-hidden rounded-none dark:bg-neutral-800/80 dark:text-slate-100"
              >
                {dropdownItems?.map(
                  (item, index) =>
                    item.href &&
                    item.title !== "Sign Out of Netflix" && (
                      <DropdownMenuItem
                        key={index}
                        asChild
                        className="dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 "
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
                {dropdownItems?.map(
                  (item, index) =>
                    item.title === "Sign Out of Netflix" && (
                      <DropdownMenuItem
                        key={index}
                        asChild
                        className="dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 "
                        onClick={() => void signOut()}
                      >
                        <span className="mx-auto line-clamp-1">
                          {item.title}
                        </span>
                      </DropdownMenuItem>
                    )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              aria-label="Sign In"
              variant="brand"
              className="h-auto px-4 py-2"
              onClick={() => void signIn("google")}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader
