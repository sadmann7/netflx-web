import Link from "next/link"

import { siteConfig } from "@/config/site"

const SiteFooter = () => {
  return (
    <footer aria-label="Footer" className="w-full text-neutral-500">
      <div className="container mx-0 grid w-full max-w-6xl gap-7 py-10">
        <p className="cursor-pointer text-sm font-medium hover:underline md:text-base">
          Questions? Contact us.
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {siteConfig.footerItems.map((item, i) =>
            item.href && item.external ? (
              <li key={i} className="text-xs hover:underline md:text-sm">
                <a href={item.href}>{item.title}</a>
              </li>
            ) : (
              item.href && (
                <li key={i} className="text-xs hover:underline md:text-sm">
                  <Link href={item.href}>{item.title}</Link>
                </li>
              )
            )
          )}
        </ul>
        <p className="text-xs md:text-sm">Netflix Bangladesh</p>
      </div>
    </footer>
  )
}

export default SiteFooter
