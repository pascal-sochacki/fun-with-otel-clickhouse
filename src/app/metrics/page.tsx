import { createClient } from "@clickhouse/client";
import { metrics } from "@opentelemetry/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SumChart } from "./SumChart";

const meter = metrics.getMeter("clickhouse");
const counter = meter.createCounter("clickhouse.metrics.opend");

interface SumMetric {
  Value: number;
  TimeUnix: string;
  MetricName: string;
}

export default async function Page() {
  const client = createClient({
    database: "otel",
  });
  counter.add(1);
  const metrics = await client.query({
    query: "SELECT * FROM otel_metrics_sum WHERE MetricName = 'calls'",
    format: "JSONEachRow",
  });
  const metricsJson = await metrics.json();
  console.log(
    metricsJson
      .map((m) => m.Attributes["status.code"])
      .filter((s) => s !== "STATUS_CODE_UNSET"),
  );

  const resultSet = await client.query({
    query:
      "SELECT * FROM otel_metrics_sum WHERE MetricName = 'clickhouse.metrics.opend' ORDER BY TimeUnix ",
    format: "JSONEachRow",
  });
  const dataset = await resultSet.json<SumMetric>();
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
            <div>Works</div>

            <SumChart
              config={{
                metric: {
                  label: "Metric",
                  color: "#2563eb",
                },
              }}
              data={dataset.map((d) => {
                return { metric: d.Value, time: new Date(d.TimeUnix) };
              })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
