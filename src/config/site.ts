import type { SiteConfig } from "@/types"

import { absoluteUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"

export const siteConfig: SiteConfig = {
  name: "Netflix",
  description:
    "An open source Netflix clone built using the new router, server components, trpc and everything new in Next.js 13.",
  url: "https://netflx-web.vercel.app",
  ogImage: absoluteUrl("/src/pages/api/og.tsx"),
  links: {
    twitter: "https://twitter.com/sadmann17",
    github: "https://github.com/sadmann7",
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
      icon: Icons.home,
    },
    {
      title: "TV Shows",
      href: "/tv-shows",
      icon: Icons.tvShow,
    },
    {
      title: "Movies",
      href: "/movies",
      icon: Icons.movie,
    },
    {
      title: "New & Popular",
      href: "/new-and-popular",
      icon: Icons.trendingUp,
    },
    {
      title: "My List",
      href: "/my-list",
      icon: Icons.list,
    },
    {
      title: "Notifications",
      onClick: () => alert("🛹 Do a kickflip"),
      icon: Icons.bell,
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
