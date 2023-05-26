import { Inter as FontSans } from "next/font/google"
import TRPCProvider from "@/context/trpc-provider"

import { siteConfig } from "@/config/site"
import { absoluteUrl, cn } from "@/lib/utils"
import TailwindIndicator from "@/components/tailwind-indicator"
import ToastWrapper from "@/components/ui/toast-wrapper"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "TRPC",
    "T3-App",
    "Netflix",
    "Netflix OTT",
    "Netflix Clone",
  ],
  authors: [
    {
      name: "sadmann7",
      url: "https://github.com/sadmann7",
    },
  ],
  creator: "sadmann7",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteUrl("/src/pages/api/og.tsx"),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/api/og.tsx`],
    creator: "@sadmann17",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <TRPCProvider>
      <html
        lang="en"
        className={cn(
          "scroll-smooth bg-neutral-900 font-sans text-slate-50 antialiased",
          fontSans.variable
        )}
      >
        <head />
        <body className="min-h-screen">
          {children}
          <ToastWrapper />
          <TailwindIndicator />
          <Analytics />
        </body>
      </html>
    </TRPCProvider>
  )
}
