import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const iconRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const icons = await ctx.prisma.icon.findMany()
    return icons
  }),
})
