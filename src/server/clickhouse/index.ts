import { createClient } from "@clickhouse/client";

export const clickhouse = createClient({
  database: "otel",
});
