"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HTTP_TARGET } from "./const";
import { TraceTable } from "~/components/ui/tables";
import { AttributeSelector, type KeyValue } from "./AttributeSelector";
import { api } from "~/trpc/react";
import React from "react";

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

export default function Home() {
  const [selectedAttributes, setSelectedAttributes] = React.useState<KeyValue>({
    key: "",
    value: "",
  });
  const traces = api.traces.getTracesForAttribute.useQuery(selectedAttributes);
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
            <AttributeSelector setSelectedAttributes={setSelectedAttributes} />
            <TraceTable
              dataset={(traces.data ?? []).map((trace) => {
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
