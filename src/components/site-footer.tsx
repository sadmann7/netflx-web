import Link from "next/link"
import type { NavItem } from "@/types"

const footerItems = [
  { title: "FAQ", href: "/", external: false },
  { title: "Help Center", href: "/", external: false },
  { title: "Account", href: "/", external: false },
  { title: "Media Center", href: "/", external: false },
  { title: "Investor Relations", href: "/", external: false },
  { title: "Jobs", href: "/", external: false },
  { title: "Ways to Watch", href: "/", external: false },
  { title: "Terms of Use", href: "/", external: false },
  { title: "Privacy", href: "/", external: false },
  { title: "Cookie Preferences", href: "/", external: false },
  { title: "Corporate Information", href: "/", external: false },
  { title: "Contact Us", href: "/", external: false },
  { title: "Speed Test", href: "https://fast.com/", external: true },
  { title: "Legal Notices", href: "/", external: false },
  { title: "Only on Netflix", href: "/", external: false },
] satisfies NavItem[]

const SiteFooter = () => {
  return (
    <footer
      aria-label="footer"
      className="border-t-8 border-t-zinc-800 text-slate-400"
    >
      <div className="container mx-auto w-full max-w-screen-lg py-10">
        <p className="cursor-pointer text-sm font-medium hover:underline md:text-base">
          Questions? Contact us.
        </p>
        <ul className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {footerItems.map((item, i) =>
            item.external ? (
              <li key={i} className="text-xs hover:underline md:text-sm">
                <a href={item.href}>{item.title}</a>
              </li>
            ) : (
              <li key={i} className="text-xs hover:underline md:text-sm">
                <Link href={item.href}>{item.title}</Link>
              </li>
            )
          )}
        </ul>
        <p className="text-xs md:text-sm">Netflix Bangladesh</p>
      </div>
    </footer>
  )
}

export default SiteFooter
