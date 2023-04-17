import type { SiteConfig } from "@/types"

import { Icons } from "@/components/icons"

export const siteConfig: SiteConfig = {
  name: "Netflix",
  description:
    "An open source Netflix clone built using the new router, server components, trpc and everything new in Next.js 13.",
  url: "https://netflx-web.vercel.app",
  ogImage: "https://tx.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/sadmann17",
    github: "https://github.com/sadmann7",
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "TV Shows",
      href: "/tv-shows",
    },
    {
      title: "Movies",
      href: "/movies",
    },
    {
      title: "New & Popular",
      href: "/new-and-popular",
    },
    {
      title: "My List",
      href: "/my-list",
    },
  ],
  profileDropdownItems: [
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
  ],
}
