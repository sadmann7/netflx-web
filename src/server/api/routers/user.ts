import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const userRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        phoneNumber: z
          .string()
          .refine((value) => {
            const regex =
              /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
            return regex.test(value)
          })
          .optional()
          .nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if any other user has the same email
      const userWithEmail = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })
      if (
        userWithEmail &&
        userWithEmail.email &&
        userWithEmail.id !== input.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Email already in already taken",
        })
      }

      // check if any other user has the same phone number
      const userWithPhoneNumber = await ctx.prisma.user.findFirst({
        where: { phoneNumber: input.phoneNumber },
      })
      if (
        userWithPhoneNumber &&
        userWithPhoneNumber.phoneNumber &&
        userWithPhoneNumber.id !== input.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Phone number is already taken",
        })
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          email: input.email,
          phoneNumber: input.phoneNumber,
        },
      })
      return user
    }),
})
