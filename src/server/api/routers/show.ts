import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { MEDIA_TYPE } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const showRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const shows = await ctx.prisma.show.findMany({
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
      const show = await ctx.prisma.show.findUnique({
        where: { tmdbId: input.tmdbId },
      })
      if (show) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Show already exists",
        })
      }

      const createdShow = await ctx.prisma.show.create({
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
})
