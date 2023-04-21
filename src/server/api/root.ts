import { iconRouter } from "@/server/api/routers/icon"
import { profileRouter } from "@/server/api/routers/profile"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  icon: iconRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
