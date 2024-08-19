import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
export const traceRouter = createTRPCRouter({
  getAttributeKeys: publicProcedure.query(async ({ ctx }) => {
    const attributeKeys = await ctx.clickhouse.query({
      query:
        "SELECT groupArrayDistinctArray(mapKeys(SpanAttributes)) AS `value` FROM otel_traces",
      format: "JSONEachRow",
    });
    const attributeKeysJson = await attributeKeys.json<{ value: string[] }>();
    return attributeKeysJson[0]?.value ?? [];
  }),

  getAttributeValuesForKey: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const attributeKeys = await ctx.clickhouse.query({
        query:
          "SELECT DISTINCT SpanAttributes[{key: String}] AS `value` FROM otel_traces",
        query_params: {
          key: input,
        },
        format: "JSONEachRow",
      });
      const attributeKeysJson = await attributeKeys.json<{ value: string }>();
      return attributeKeysJson.map((k) => k.value);
    }),
});
