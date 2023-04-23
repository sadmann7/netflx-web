import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { LANGUAGE } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const profileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const profiles = await ctx.prisma.profile.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        icon: true,
      },
    })
    return profiles
  }),

  getOthers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const profiles = await ctx.prisma.profile.findMany({
        where: {
          id: {
            not: input,
          },
        },
        include: {
          icon: true,
        },
      })
      return profiles
    }),

  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
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

      // check if user has a profile with the same name
      const profileName = profiles.find(
        (profile) => profile.name === input.name
      )
      if (profileName) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Profile name is already taken",
        })
      }

      // check if user has a profile with the same icon
      const profileIcon = profiles.find(
        (profile) => profile.iconId === input.iconId
      )
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
        language: z.nativeEnum(LANGUAGE),
        gameHandle: z.string().optional(),
        email: z.string().optional(),
        pin: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.update({
        where: { id: input.id },
        data: {
          name: input.name,
          icon: { connect: { id: input.iconId } },
          language: input.language,
          gameHandle: input.gameHandle,
          email: input.email,
          pin: input.pin,
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
})
