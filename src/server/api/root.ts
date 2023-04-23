import { iconRouter } from "@/server/api/routers/icon"
import { myListRouter } from "@/server/api/routers/my-list"
import { profileRouter } from "@/server/api/routers/profile"
import { userRouter } from "@/server/api/routers/user"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  profile: profileRouter,
  icon: iconRouter,
  myList: myListRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
