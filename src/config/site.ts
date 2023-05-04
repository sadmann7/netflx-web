import { useProfileStore } from "@/stores/profile"
import type { SiteConfig } from "@/types"

import { Icons } from "@/components/icons"

export const siteConfig: SiteConfig = {
  name: "Netflix Web",
  description:
    "An open source Netflix clone built using the new app router, server components, trpc, and everything new in Next.js 13.",
  url: "https://netflx-web.vercel.app",
  ogImage: "https://netflx-web.vercel.app/opengraph-image.png",
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
      href: "/profiles",
      icon: Icons.edit,
    },
    {
      title: "Exit Profile",
      icon: Icons.externalLink,
      onClick: () => useProfileStore.setState({ profile: null }),
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
    },
  ],
  footerItems: [
    { title: "Audio Description", href: "/" },
    { title: "Help Center", href: "/" },
    { title: "Gift Cards", href: "/" },
    { title: "Media Center", href: "/" },
    { title: "Investor Relations", href: "/" },
    { title: "Jobs", href: "/" },
    { title: "Terms of Use", href: "/terms-of-use" },
    { title: "Privacy", href: "/" },
    { title: "Legal Notices", href: "/" },
    { title: "Cookie Preferences", href: "/" },
    { title: "Corporate Information", href: "/" },
    { title: "Contact Us", href: "/" },
  ],
  socialLinks: [
    {
      title: "Facebook",
      href: "https://www.facebook.com/NetflixAsia",
      icon: Icons.facebook,
    },
    {
      title: "Instagram",
      href: "https://www.instagram.com/netflixasia/",
      icon: Icons.instagram,
    },
    {
      title: "Twitter",
      href: "https://twitter.com/NetflixAsia",
      icon: Icons.twitter,
    },
    {
      title: "Youtube",
      href: "https://www.youtube.com/channel/UCZoC-XeDO7HxbAdeCaRPPCw/videos",
      icon: Icons.youtube,
    },
  ],
}
