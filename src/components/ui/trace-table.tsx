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
import { type Span } from "~/app/traces/page";
import Link from "next/link";
import { type Logs } from "~/app/logs/page";

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
        { accessorKey: "HttpRoute", header: "Route" },
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
