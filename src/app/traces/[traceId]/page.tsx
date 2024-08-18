import TraceViewer from "./TraceView";
import { Card, CardContent } from "~/components/ui/card";
import { clickhouse } from "~/server/clickhouse";
import { type Span } from "../page";

export default async function Page({
  params,
}: {
  params: { traceId: string };
}) {
  const resultSet = await clickhouse.query({
    query: "SELECT * FROM otel_traces WHERE TraceId = {traceId: String}",
    query_params: {
      traceId: params.traceId,
    },
    format: "JSONEachRow",
  });
  const dataset = await resultSet.json<Span>();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardContent className="pl-2">
            <TraceViewer spans={dataset} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
