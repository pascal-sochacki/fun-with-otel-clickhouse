import { metrics } from "@opentelemetry/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { clickhouse } from "~/server/clickhouse";
import HeatMap from "./HeatMap";

const meter = metrics.getMeter("clickhouse");
const counter = meter.createCounter("clickhouse.metrics.opend");

interface SumMetric {
  Value: number;
  TimeUnix: string;
  MetricName: string;
}

export default async function Page() {
  counter.add(1);

  const resultSet = await clickhouse.query({
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
            <HeatMap width={400} height={200} events={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
