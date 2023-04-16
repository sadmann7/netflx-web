import type { AppRouter } from "@/server/api/root"
import type { TRPCClientErrorLike } from "@trpc/client"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface TrpcErrorScreenProps {
  error?: TRPCClientErrorLike<AppRouter>
  reset?: () => void
}

const TrpcErrorScreen = ({ error, reset }: TrpcErrorScreenProps) => {
  return (
    <section
      aria-label="Error screen"
      role="alert"
      className="container grid min-h-screen max-w-screen-2xl items-center justify-center gap-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-24 lg:pt-16"
    >
      <Icons.warning
        className="h-28 w-28 animate-pulse text-red-500 dark:text-red-500"
        aria-hidden="true"
      />
      <h1 className="text-center text-2xl font-bold text-red-500 dark:text-red-500 sm:text-2xl lg:text-3xl">
        {error?.message ?? "Something went wrong!"}
      </h1>
      <table>
        <thead className="text-base font-medium text-slate-900 dark:text-slate-50 sm:text-lg">
          <tr>
            <th>Try doing these:</th>
          </tr>
        </thead>
        <tbody className="text-base font-medium text-slate-500 dark:text-slate-400 sm:text-lg">
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
      {reset ? (
        <Button
          aria-label="Try again"
          variant="destructive"
          onClick={() => reset()}
        >
          Try again
        </Button>
      ) : null}
    </section>
  )
}

export default TrpcErrorScreen
