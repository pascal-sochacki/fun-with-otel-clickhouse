import { metrics } from "@opentelemetry/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import HeatMap, { type Bins } from "./HeatMap";
import { api } from "~/trpc/server";

const meter = metrics.getMeter("clickhouse");
const counter = meter.createCounter("clickhouse.metrics.opend");

export default async function Page() {
  counter.add(1);

  const a = await api.metrics.createHeatMap();

  const list: Bins[] = [];

  for (const iterator of Object.keys(a)) {
    console.log(iterator);
    console.log(a[iterator]);
    list.push({
      time: iterator,
      bins: a[iterator]!,
    });
  }

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
            <HeatMap width={400} height={200} events={true} binData={list} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
