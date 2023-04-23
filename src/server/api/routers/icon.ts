import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
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
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const icons = await ctx.prisma.icon.findMany({
        where: {
          id: {
            not: input,
          },
          profiles: {
            every: {
              userId: {
                not: ctx.session.user.id,
              },
            },
          },
        },
      })
      return icons
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        icon: true,
      },
    })
    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      })
    }
    return profile.icon
  }),
})
