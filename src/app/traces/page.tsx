import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HTTP_TARGET } from "./const";
import { clickhouse } from "~/server/clickhouse";
import { TraceTable } from "~/components/ui/tables";
import { AttributeSelector } from "./AttributeSelector";

export interface Span {
  Timestamp: string;
  Duration: string;
  TraceId: string;
  SpanName: string;
  SpanId: string;
  ParentSpanId: string;
  TraceState: string;
  SpanKind: string;
  ServiceName: string;
  ResourceAttributes: string;
  ScopeName: string;
  ScopeVersion: string;
  SpanAttributes: Record<string, string>;
  StatusCode: string;
  StatusMessage: string;
}

export default async function Home() {
  const resultSet = await clickhouse.query({
    query:
      "SELECT * FROM otel_traces WHERE ParentSpanId = '' AND Timestamp >= NOW() - INTERVAL 3 MINUTE ORDER BY Timestamp DESC",
    format: "JSONEachRow",
  });

  const dataset = await resultSet.json<Span>();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Newest Traces</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AttributeSelector />
            <TraceTable
              dataset={dataset.map((trace) => {
                return {
                  ...trace,
                  HttpRoute: trace.SpanAttributes[HTTP_TARGET] ?? "unkown",
                };
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
