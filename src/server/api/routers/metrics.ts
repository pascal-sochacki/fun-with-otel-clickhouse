import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
export const metricsRouter = createTRPCRouter({
  createHeatMap: publicProcedure
    .output(
      z.record(
        z.string(),
        z.array(
          z.object({
            Lower: z.string(),
            Time: z.string(),
            count: z.string(),
          }),
        ),
      ),
    )

    .query(async ({ ctx }) => {
      const attributeKeys = await ctx.clickhouse.query({
        query:
          "SELECT toUInt32(Duration / 100000000) * 100 as Lower, toStartOfHour(Timestamp) as Time, count(*) as count FROM otel_traces WHERE ParentSpanId = '' GROUP by ALL ORDER BY Lower;",

        format: "JSONEachRow",
      });
      const a = await attributeKeys.json();
      return Object.groupBy(a, (a) => a.Time);
    }),
});
