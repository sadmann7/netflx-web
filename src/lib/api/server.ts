import { createTRPCNextLayout } from "@/@trpc/next-layout/server"
import { auth as getAuth } from "@clerk/nextjs/app-beta"
import superjson from "superjson"

import "server-only"
import { createContextInner } from "@/server/api/context"
import { appRouter } from "@/server/api/root"

export const api = createTRPCNextLayout({
  router: appRouter,
  transformer: superjson,
  createContext() {
    const auth = getAuth()
    return createContextInner({
      auth,
      req: null,
    })
  },
})
