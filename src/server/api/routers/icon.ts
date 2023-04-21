import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { z } from "zod"

export const iconRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const icons = await ctx.prisma.icon.findMany()
    return icons
  }),

  getAllUsed: protectedProcedure.query(async ({ ctx }) => {
    const icons = await ctx.prisma.icon.findMany({
      where: {
        profiles: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    })
    return icons
  }),

  getAllUnused: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          icon: true,
        },
      })
      const icons = await ctx.prisma.icon.findMany({
        where: {
          NOT: {
            id: input ?? profile?.iconId,
          },
        },
      })
      return icons
    }),
})
