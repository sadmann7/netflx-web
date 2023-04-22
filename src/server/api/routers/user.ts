import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),

  getCurrent: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      return null
    }
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    })
    return user
  }),

  getCurrentWithProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        profiles: {
          include: {
            icon: true,
          },
        },
      },
    })
    return user
  }),
})
