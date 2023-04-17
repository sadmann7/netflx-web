import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const path = usePathname()

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden md:block">
        <Image
          src="/images/netflix-logo.svg"
          alt="netflix"
          width={1024}
          height={276.74}
          className="h-auto w-28 object-cover transition-opacity hover:opacity-75 active:opacity-100"
          priority
        />
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 sm:text-sm",
                    path === item.href &&
                      "font-semibold text-slate-900 dark:text-white",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto px-2 py-1.5 text-base hover:bg-transparent focus:ring-0 hover:dark:bg-neutral-800 md:hidden"
          >
            <Icons.logo className="mr-2 h-4 w-4 text-red-600" />
            <span className="font-bold">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={20}
          className="w-52 overflow-y-auto overflow-x-hidden rounded-sm dark:bg-neutral-800/90 dark:text-slate-200"
        >
          <DropdownMenuLabel>
            <Link href="/" className="flex items-center">
              <Icons.logo
                className="mr-2 h-4 w-4 text-red-600"
                aria-hidden="true"
              />
              {siteConfig.name}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items?.map(
            (item, index) =>
              item.href && (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className="dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <Link href={item.href}>
                    {item.icon && (
                      <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="line-clamp-1">{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
