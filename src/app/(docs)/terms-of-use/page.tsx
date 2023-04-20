import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Tony Hawk's games have some gnarly soundtrack",
}

export default function TOUPage() {
  return (
    <section className="container flex max-w-screen-2xl flex-col gap-5 pb-16 pt-10">
      <h1 className="text-2xl font-bold sm:text-4xl">
        Tony {`Hawk's`} American Wasteland
      </h1>
      <table>
        <thead className="text-base font-medium text-slate-900 dark:text-slate-50 sm:text-lg">
          <tr className="text-left">
            <th>Your objectives:</th>
          </tr>
        </thead>
        <tbody className="text-base font-medium text-slate-700 dark:text-slate-400 sm:text-lg">
          <tr>
            <td>1. Spine transfer to nosegrab frontflip</td>
          </tr>
          <tr>
            <td>2. Wall flip to natas spin</td>
          </tr>
          <tr>
            <td>3. Sticker slap to manual to wallplant</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
