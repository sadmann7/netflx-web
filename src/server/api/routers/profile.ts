import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const profileRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input },
        include: {
          profiles: true,
        },
      })
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }
      return user.profiles
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: { id: ctx.session.user.id },
    })
    return profile
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingProfile = await ctx.prisma.profile.findUnique({
        where: { id: ctx.session.user.id },
      })
      if (existingProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Profile already exists",
        })
      }
      const profile = await ctx.prisma.profile.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          name: input.name,
          image: input.image,
        },
      })
      return profile
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        gameHandle: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: input.id },
        data: {
          name: input.name,
          image: input.image,
          gameHandle: input.gameHandle,
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
