import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { type Span } from "~/app/traces/page";
export const traceRouter = createTRPCRouter({
  getAttributeKeys: protectedProcedure.query(async ({ ctx }) => {
    const attributeKeys = await ctx.clickhouse.query({
      query:
        "SELECT groupArrayDistinctArray(mapKeys(SpanAttributes)) AS `value` FROM otel_traces",
      format: "JSONEachRow",
    });
    const attributeKeysJson = await attributeKeys.json<{ value: string[] }>();
    return attributeKeysJson[0]?.value ?? [];
  }),

  getAttributeValuesForKey: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const attributeKeys = await ctx.clickhouse.query({
        query:
          "SELECT DISTINCT SpanAttributes[{key: String}] AS `value` FROM otel_traces WHERE has(mapKeys(SpanAttributes), {key: String})",
        query_params: {
          key: input,
        },
        format: "JSONEachRow",
      });
      const attributeKeysJson = await attributeKeys.json<{ value: string }>();
      console.log(attributeKeysJson);
      return attributeKeysJson.map((k) => k.value);
    }),

  getTracesForAttribute: protectedProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.key == "" && input.value == "") {
        const resultSet = await ctx.clickhouse.query({
          query:
            "SELECT * FROM otel_traces WHERE ParentSpanId = '' AND Timestamp >= NOW() - INTERVAL 3 MINUTE ORDER BY Timestamp DESC",
          format: "JSONEachRow",
        });
        const dataset = await resultSet.json<Span>();
        return dataset;
      } else {
        console.log(input);
        const resultSet = await ctx.clickhouse.query({
          query:
            "SELECT * FROM otel_traces SpanAttributes[{key: String}] = {value: String} ORDER BY Timestamp DESC",
          query_params: {
            key: input.key,
            value: input.value,
          },
          format: "JSONEachRow",
        });
        const dataset = await resultSet.json<Span>();
        console.log(dataset);
        return dataset;
      }
    }),
});
