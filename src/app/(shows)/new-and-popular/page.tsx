import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New & Popular",
  description: "All new and popular shows grouped by genre",
}

export default function NewAndPopularPage() {
  return (
    <section className="container grid h-screen items-center justify-center gap-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-24 lg:pt-16">
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <h1 className="text-center text-3xl font-bold text-slate-50 md:text-4xl lg:text-5xl">
          New & Popular
        </h1>
        <p className="text-center text-slate-500">Coming soon...</p>
      </div>
    </section>
  )
}
