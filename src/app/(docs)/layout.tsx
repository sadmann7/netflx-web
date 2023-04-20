import { getSession } from "@/lib/session"
import SiteFooter from "@/components/layouts/site-footer"
import SiteHeader from "@/components/layouts/site-header"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const session = await getSession()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader session={session} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
