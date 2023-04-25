import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { MEDIA_TYPE } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const myListRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const shows = await ctx.prisma.myShow.findMany({
      where: { profileId: input },
    })
    return shows
  }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        profileId: z.string(),
        name: z.string(),
        title: z.string(),
        original_title: z.string().optional(),
        poster_path: z.string().optional(),
        backdrop_path: z.string().optional(),
        overview: z.string().optional(),
        original_language: z.string(),
        media_type: z.nativeEnum(MEDIA_TYPE),
        popularity: z.number(),
        vote_average: z.number(),
        vote_count: z.number(),
        release_date: z.string().optional(),
        first_air_date: z.string().optional(),
        adult: z.boolean().default(false),
        video: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { id: input.profileId },
        include: { myList: true },
      })
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        })
      }

      const show = profile.myList.find((show) => show.id === input.id)

      if (show) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Show already exists",
        })
      }

      const createdShow = await ctx.prisma.myShow.create({
        data: {
          id: input.id,
          profileId: input.profileId,
          name: input.name,
          title: input.title,
          original_title: input.original_title,
          poster_path: input.poster_path,
          backdrop_path: input.backdrop_path,
          overview: input.overview,
          original_language: input.original_language,
          media_type: input.media_type,
          popularity: input.popularity,
          vote_average: input.vote_average,
          vote_count: input.vote_count,
          release_date: input.release_date,
          first_air_date: input.first_air_date,
          adult: input.adult,
          video: input.video,
        },
      })
      return createdShow
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        profileId: z.string(),
        name: z.string(),
        title: z.string(),
        original_title: z.string().optional(),
        poster_path: z.string().optional(),
        backdrop_path: z.string().optional(),
        overview: z.string().optional(),
        original_language: z.string(),
        media_type: z.nativeEnum(MEDIA_TYPE),
        popularity: z.number(),
        vote_average: z.number(),
        vote_count: z.number(),
        release_date: z.string().optional(),
        first_air_date: z.string().optional(),
        adult: z.boolean().default(false),
        video: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { id: input.profileId },
        include: { myList: true },
      })

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        })
      }

      const show = profile.myList.find((show) => show.id === input.id)

      if (!show) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Show not found",
        })
      }

      const updatedShow = await ctx.prisma.myShow.update({
        where: { showId: show.showId },
        data: {
          id: input.id,
          profileId: input.profileId,
          name: input.name,
          title: input.title,
          original_title: input.original_title,
          poster_path: input.poster_path,
          backdrop_path: input.backdrop_path,
          overview: input.overview,
          original_language: input.original_language,
          media_type: input.media_type,
          popularity: input.popularity,
          vote_average: input.vote_average,
          vote_count: input.vote_count,
          release_date: input.release_date,
          first_air_date: input.first_air_date,
          adult: input.adult,
          video: input.video,
        },
      })
      return updatedShow
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { id: input.profileId },
        include: { myList: true },
      })

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        })
      }

      const show = profile.myList.find((show) => show.id === input.id)

      if (!show) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Show not found",
        })
      }

      const deletedShow = await ctx.prisma.myShow.delete({
        where: { showId: show.showId },
      })
      return deletedShow
    }),
})
