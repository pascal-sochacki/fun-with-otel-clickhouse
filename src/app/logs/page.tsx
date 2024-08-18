import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LogTable } from "~/components/ui/tables";
import { loggerProvider } from "~/instrumentation.node";
import { clickhouse } from "~/server/clickhouse";

export interface Logs {
  Timestamp: string;
  TimestampDate: string;
  TimestampTime: string;
  TraceId: string;
  SpanId: string;
  TraceFlags: number;
  SeverityText: string;
  SeverityNumber: number;
  ServiceName: string;
  Body: string;
  ResourceSchemaUrl: string;
  ScopeSchemaUrl: string;
  ScopeName: string;
  ScopeVersion: string;
}

const logger = loggerProvider.getLogger("clickhouse");

export default async function Page() {
  logger.emit({
    severityText: "info",
    body: "this is a log body",
    attributes: { "log.type": "custom" },
  });

  const resultSet = await clickhouse.query({
    query: "SELECT * FROM otel_logs ORDER BY Timestamp DESC",
    format: "JSONEachRow",
  });
  const dataset = await resultSet.json<Logs>();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Newest Logs</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LogTable dataset={dataset} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
