import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const profileRouter = createTRPCRouter({
  // get current user for quick access to any client-side data
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      return null
    }
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    })
    return user
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const profiles = await ctx.prisma.profile.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        icon: true,
      },
    })
    return profiles
  }),

  getOne: protectedProcedure.query(async ({ ctx }) => {
    const profiles = await ctx.prisma.profile.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        icon: true,
      },
    })

    return profiles[0]
  }),

  getCurrent: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { id: input },
        include: {
          icon: true,
        },
      })
      return profile
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        iconId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if user has 5 profiles already
      const profiles = await ctx.prisma.profile.findMany({
        where: { userId: ctx.session.user.id },
      })
      if (profiles.length >= 5) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only have 5 profiles",
        })
      }

      // check if profile name is available
      const profileName = await ctx.prisma.profile.findUnique({
        where: { name: input.name },
      })
      if (profileName) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Profile name is already taken",
        })
      }

      // check if profile icon is available
      const profileIcon = await ctx.prisma.profile.findUnique({
        where: { iconId: input.iconId },
      })
      if (profileIcon) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Profile icon is already taken",
        })
      }

      const profile = await ctx.prisma.profile.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          name: input.name,
          icon: { connect: { id: input.iconId } },
        },
      })

      return profile
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        iconId: z.string(),
        gameHandle: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: input.id },
        data: {
          name: input.name,
          icon: { connect: { id: input.iconId } },
          gameHandle: input.gameHandle,
        },
      })
      return profile
    }),

  updateStatus: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: input },
        data: {
          watching: true,
        },
      })
      return profile
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.delete({
        where: { id: input },
      })
      return profile
    }),

  // if all profiles are deleted, delete the user
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const profiles = await ctx.prisma.profile.findMany({
      where: { userId: ctx.session.user.id },
    })
    if (profiles.length === 0) {
      await ctx.prisma.user.delete({
        where: { id: ctx.session.user.id },
      })
    }
  }),
})
