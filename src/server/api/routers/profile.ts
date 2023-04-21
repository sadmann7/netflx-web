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

  get: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        icon: true,
      },
    })
    return profile
  }),

  create: protectedProcedure
    .input(z.string())
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
      const icons = await ctx.prisma.icon.findMany()
      const randomIcon = icons[Math.floor(Math.random() * icons.length)]
      const firstIcon = await ctx.prisma.icon.findFirst()

      const profile = await ctx.prisma.profile.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          name: input,
          icon: { connect: { id: randomIcon?.id ?? firstIcon?.id } },
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
