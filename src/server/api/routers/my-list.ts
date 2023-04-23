import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { MEDIA_TYPE } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const myListRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const shows = await ctx.prisma.myListShow.findMany({
      where: { profileId: input },
    })
    return shows
  }),

  create: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        tmdbId: z.number(),
        name: z.string(),
        poster: z.string().optional(),
        mediaType: z.nativeEnum(MEDIA_TYPE),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const show = await ctx.prisma.myListShow.findUnique({
        where: { tmdbId: input.tmdbId },
      })
      if (show) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Show already exists",
        })
      }

      const createdShow = await ctx.prisma.myListShow.create({
        data: {
          profileId: input.profileId,
          tmdbId: input.tmdbId,
          name: input.name,
          poster: input.poster,
          mediaType: input.mediaType,
        },
      })
      return createdShow
    }),

  update: protectedProcedure
    .input(
      z.object({
        tmdbId: z.number(),
        name: z.string(),
        poster: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const show = await ctx.prisma.myListShow.findUnique({
        where: { tmdbId: input.tmdbId },
      })
      if (!show) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Show not found",
        })
      }

      const updatedShow = await ctx.prisma.myListShow.update({
        where: { tmdbId: input.tmdbId },
        data: {
          name: input.name,
          poster: input.poster,
        },
      })
      return updatedShow
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const show = await ctx.prisma.myListShow.findUnique({
        where: { tmdbId: input },
      })
      if (!show) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Show not found",
        })
      }

      const deletedShow = await ctx.prisma.myListShow.delete({
        where: { tmdbId: input },
      })
      return deletedShow
    }),
})
