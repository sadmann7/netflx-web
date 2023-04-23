import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Help Center for THPS",
}

export default function HelpCenterPage() {
  return (
    <section className="container flex max-w-screen-2xl flex-col gap-5 pb-16 pt-10">
      <h1 className="text-2xl font-bold sm:text-4xl">
        Tony {`Hawk's`} Pro Skater
      </h1>
      <table>
        <thead className="text-base font-medium text-slate-900 dark:text-slate-50 sm:text-lg">
          <tr className="text-left">
            <th>Here is some helpful tips:</th>
          </tr>
        </thead>
        <tbody className="text-base font-medium text-slate-700 dark:text-slate-400 sm:text-lg">
          <tr>
            <td>
              1. Keep your eyes on the prize. The goal is to get the highest
              score possible. The more points you get, the more money you earn.
            </td>
          </tr>
          <tr>
            <td>
              2. The more money you earn, the more tricks you can learn. The
              more tricks you learn, the more points you can get.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
