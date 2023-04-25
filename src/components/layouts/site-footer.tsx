import Link from "next/link"

import { siteConfig } from "@/config/site"
import SetTextButton from "@/components/set-text-button"
import { buttonVariants } from "@/components/ui/button"

const SiteFooter = () => {
  return (
    <footer aria-label="Footer" className="w-full">
      <div className="container grid w-full max-w-6xl gap-7 py-10 text-neutral-400">
        <div className="flex flex-wrap items-center gap-2">
          {siteConfig.socialLinks.map(
            (item, i) =>
              item.href && (
                <Link key={i} href={item.href} target="_blank" rel="noreferrer">
                  <div
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className:
                        "rounded-none text-neutral-700 hover:bg-transparent hover:text-red-600 dark:text-neutral-50 dark:hover:bg-transparent hover:dark:text-red-600",
                    })}
                  >
                    {item.icon && <item.icon className="h-6 w-6" />}
                    <span className="sr-only">{item.title}</span>
                  </div>
                </Link>
              )
          )}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {siteConfig.footerItems.map((item, i) =>
            item.href && item.external ? (
              <li key={i} className="text-xs hover:underline sm:text-sm">
                <a href={item.href}>{item.title}</a>
              </li>
            ) : (
              item.href && (
                <li key={i} className="text-xs hover:underline sm:text-sm">
                  <Link href={item.href}>{item.title}</Link>
                </li>
              )
            )
          )}
        </ul>
        <SetTextButton
          initialText="Service Code"
          finalText={Math.random().toString(36).substring(7)}
          variant="outline"
          className="h-auto w-fit rounded-none py-1.5 text-sm text-neutral-400 dark:text-neutral-400"
        />
        <p className="text-xs sm:text-sm">
          @ 2023-{new Date().getFullYear()} Netflx.
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
