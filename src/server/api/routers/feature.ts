import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { CreateFeatureFlagSchema } from "./types";
import { flags } from "~/server/db/schema";
import { eq } from "drizzle-orm";
export const featureRouter = createTRPCRouter({
  createFeatureFlag: protectedProcedure
    .input(CreateFeatureFlagSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(flags).values({
        name: input.name,
        state: "ENABLED",
        variants: {
          on: true,
          off: false,
        },
        defaultVariant: "on",
      });
    }),
  getAllFeatureFlag: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(flags).orderBy(flags.name);
  }),
  deleteFeatureFlag: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(flags).where(eq(flags.name, input));
    }),
  toggleFeatureFlag: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        state: z.enum(["ENABLED", "DISABLED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(flags)
        .set({ state: input.state })
        .where(eq(flags.name, input.name));
    }),
});
