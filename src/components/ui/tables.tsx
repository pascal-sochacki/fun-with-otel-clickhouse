"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import Link from "next/link";
import { type Logs } from "~/app/logs/page";
import { type Span } from "~/app/traces/page";
import { api, RouterOutputs } from "~/trpc/react";
import { Switch } from "./switch";
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function Duration(props: { duration: number }) {
  if (props.duration > 1000000) {
    return <> {props.duration / 1000000} ms</>;
  }
  if (props.duration > 1000) {
    return <> {props.duration / 1000} ns</>;
  }
  return <> {props.duration} ns</>;
}
export function AttributeTable(props: { span: Span }) {
  const keys = Object.keys(props.span.SpanAttributes);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-0 w-1/3 p-0">Key</TableHead>
            <TableHead className="h-0 p-0">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.length ? (
            keys
              .sort((a, b) => a.localeCompare(b))
              .map((row) => (
                <TableRow key={row}>
                  <TableCell className="p-0">{row}</TableCell>
                  <TableCell className="p-0">
                    {props.span.SpanAttributes[row]}
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={keys.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function FeatureFlagTable(props: {
  dataset: RouterOutputs["feature"]["getAllFeatureFlag"];
}) {
  const context = api.useContext();
  const mutation = api.feature.toggleFeatureFlag.useMutation({
    onSuccess: () => context.feature.getAllFeatureFlag.invalidate(),
  });
  const deleteFlag = api.feature.deleteFeatureFlag.useMutation({
    onSuccess: () => context.feature.getAllFeatureFlag.invalidate(),
  });
  return (
    <DataTable
      data={props.dataset}
      columns={[
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "state",
          header: "Enabled",
          cell(props) {
            return (
              <div className="flex items-center gap-2">
                <Switch
                  checked={props.row.original.state == "ENABLED"}
                  onCheckedChange={async (e) => {
                    mutation.mutate({
                      name: props.row.original.name,
                      state: e ? "ENABLED" : "DISABLED",
                    });
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteFlag.mutate(props.row.original.name);
                  }}
                >
                  {" "}
                  Delete
                </Button>
              </div>
            );
          },
        },
      ]}
    />
  );
}

export function LogTable(props: { dataset: Logs[] }) {
  return (
    <DataTable
      data={props.dataset}
      columns={[
        {
          accessorKey: "Timestamp",
          header: "Timestamp",
        },

        {
          accessorKey: "SeverityText",
          header: "Severity",
        },
        {
          accessorKey: "Body",
          header: "Message",
        },
      ]}
    />
  );
}

export function TraceTable(props: {
  dataset: {
    TraceId: string;
    SpanName: string;
    HttpRoute: string;
    Timestamp: string;
    Duration: string;
  }[];
}) {
  return (
    <DataTable
      columns={[
        {
          accessorKey: "TraceId",
          header: "Trace ID",
          cell(props) {
            return (
              <Link href={`/traces/${props.row.original.TraceId}`}>
                {props.row.original.TraceId}
              </Link>
            );
          },
        },
        { accessorKey: "SpanName", header: "Name" },
        { accessorKey: "Timestamp", header: "Timestamp" },
        {
          accessorKey: "HttpRoute",
          header: "Route",
          cell(props) {
            return <div> {props.row.original.HttpRoute.substring(0, 30)}</div>;
          },
        },
        {
          accessorKey: "Duration",
          header: "Duration",
          cell(props) {
            return <Duration duration={Number(props.row.original.Duration)} />;
          },
        },
      ]}
      data={props.dataset}
    ></DataTable>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
