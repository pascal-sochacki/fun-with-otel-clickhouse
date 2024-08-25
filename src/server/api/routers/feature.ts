import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateFeatureFlagSchema } from "./types";
import { flags } from "~/server/db/schema";
export const featureRouter = createTRPCRouter({
  createFeatureFlag: protectedProcedure
    .input(CreateFeatureFlagSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(flags).values({
        name: input.name,
        state: "ENABLED",
        defaultVariant: "enabled",
        variants: {},
      });
    }),
});
